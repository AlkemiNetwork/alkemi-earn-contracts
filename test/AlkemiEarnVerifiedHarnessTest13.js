"use strict";

const Web3_ = require("web3");
const web3_ = new Web3_(web3.currentProvider);

const { ErrorEnum, FailureInfoEnum } = require("./ErrorReporter");
const { assets, bigNums, checksum, gas, getExpMantissa } = require("./Utils");
const { getContract, readAndExecContract } = require("./Contract");
const AlkemiEarnVerifiedHarness = getContract(
	"./test/AlkemiEarnVerifiedHarness.sol"
);
const PriceOracleHarness = getContract("./test/PriceOracleHarness.sol");
const EIP20 = getContract("./test/EIP20Harness.sol");
const EIP20NonStandardThrow = getContract(
	"./test/EIP20NonStandardThrowHarness.sol"
);
const SimpleInterestRateModel = getContract(
	"./test/InterestRateModel/SimpleInterestRateModel.sol"
);

contract("AlkemiEarnVerifiedHarness", function ([root, ...accounts]) {
	// TODO: If we don't specify gas when doing token transfer, it fails with an out of gas excpetion. Why?
	// In other words: Why does the block chain interaction code underestimate the gas cost of the transfer?
	const tokenTransferGas = 54687;
	const liquidationSetup = {
		totalTokenAmount: 200,
		initialTokenBalanceLiquidator: 100, // liquidator holds this much outside of protocol
		initialTokenBalanceOtherSupplier: 100, // otherSupplier supplies this much, so we have cash for the target user's borrow
		initialCollateralAmount: 10, // target user supplies this as collateral when its price is high
		initialBorrowAmount: 10, // target user borrows this much when the collateral price is high
	};

	async function setupValidLiquidation(nonStandard = false) {
		// borrower supplies OMG and borrows DRGN
		// liquidator repays borrowed loan and seizes collateral collateral
		const borrower = accounts[1];
		const liquidator = accounts[2];
		const otherSupplier = accounts[3];
		const alkemiEarnVerifiedHarness =
			await AlkemiEarnVerifiedHarness.new().send({
				from: root,
			});
		await readAndExecContract(alkemiEarnVerifiedHarness, "initializer", [], {
			from: root,
		});
		await readAndExecContract(
			alkemiEarnVerifiedHarness,
			"_changeKYCAdmin",
			[root, true],
			{
				from: root,
			}
		);
		await readAndExecContract(
			alkemiEarnVerifiedHarness,
			"_changeCustomerKYC",
			[borrower, true],
			{
				from: root,
			}
		);
		await readAndExecContract(
			alkemiEarnVerifiedHarness,
			"_changeCustomerKYC",
			[otherSupplier, true],
			{
				from: root,
			}
		);
		await readAndExecContract(
			alkemiEarnVerifiedHarness,
			"_changeCustomerKYC",
			[liquidator, true],
			{
				from: root,
			}
		);
		await readAndExecContract(
			alkemiEarnVerifiedHarness,
			"_changeLiquidator",
			[liquidator, true],
			true,
			{
				from: root,
			}
		);
		let collateral;
		let borrowed;

		if (nonStandard) {
			collateral = await EIP20NonStandardThrow.new(
				liquidationSetup.totalTokenAmount,
				"test omg ns",
				18,
				"omg"
			).send({ from: root });
			borrowed = await EIP20NonStandardThrow.new(
				liquidationSetup.totalTokenAmount,
				"test drgn ns",
				18,
				"drgn"
			).send({ from: root });
		} else {
			collateral = await EIP20.new(
				liquidationSetup.totalTokenAmount,
				"test omg",
				18,
				"omg"
			).send({ from: root });
			borrowed = await EIP20.new(
				liquidationSetup.totalTokenAmount,
				"test drgn",
				18,
				"drgn"
			).send({ from: root });
		}

		// Support markets
		// Set price of collateral to 10:1 to start with so borrower can create borrow. We'll move it down later to put them underwater.
		await alkemiEarnVerifiedHarness.methods
			.harnessSetAssetPrice(collateral._address, 10, 1)
			.send({ from: root });
		// Set price of borrowed to 1:1
		await alkemiEarnVerifiedHarness.methods
			.harnessSetAssetPrice(borrowed._address, 1, 1)
			.send({ from: root });
		await alkemiEarnVerifiedHarness.methods
			.harnessSupportMarket(collateral._address)
			.send({ from: root });
		await alkemiEarnVerifiedHarness.methods
			.harnessSupportMarket(borrowed._address)
			.send({ from: root });

		// Add collateral market for omg & drgn
		await alkemiEarnVerifiedHarness.methods
			.harnessAddCollateralMarket(collateral._address)
			.send({ from: root });
		await alkemiEarnVerifiedHarness.methods
			.harnessAddCollateralMarket(borrowed._address)
			.send({ from: root });

		// Set up SimpleInterestRateModel for collateral and borrowed market. borrow rate is 50% per block
		const simpleInterestRateModel = await SimpleInterestRateModel.new().send({
			from: root,
		});

		await alkemiEarnVerifiedHarness.methods
			._supportMarket(collateral._address, simpleInterestRateModel._address)
			.send({ from: root });
		await alkemiEarnVerifiedHarness.methods
			._supportMarket(borrowed._address, simpleInterestRateModel._address)
			.send({ from: root });

		// Set a required collateral ratio of 2:1
		await alkemiEarnVerifiedHarness.methods
			.harnessSetCollateralRatio(2, 1)
			.send({ from: root });

		// Give liquidator an approved balance of the borrowed token, borrowed, so he can repay part of the underwater loan
		await borrowed.methods
			.transfer(liquidator, liquidationSetup.initialTokenBalanceLiquidator)
			.send({ gas: tokenTransferGas, from: root });
		await borrowed.methods
			.approve(
				alkemiEarnVerifiedHarness._address,
				liquidationSetup.initialTokenBalanceLiquidator
			)
			.send({ from: liquidator });

		// Give the other supplier some borrow asset and supply it to compound.
		// This is what will fund the borrow.
		await borrowed.methods
			.transfer(
				otherSupplier,
				liquidationSetup.initialTokenBalanceOtherSupplier
			)
			.send({ from: root });
		await borrowed.methods
			.approve(
				alkemiEarnVerifiedHarness._address,
				liquidationSetup.initialTokenBalanceOtherSupplier
			)
			.send({ from: otherSupplier });
		const deliverBorrowAssetResult = await alkemiEarnVerifiedHarness.methods
			.supply(
				borrowed._address,
				liquidationSetup.initialTokenBalanceOtherSupplier
			)
			.send({ from: otherSupplier });

		// Give borrower some collateral and supply it to compound
		await collateral.methods
			.transfer(borrower, liquidationSetup.initialCollateralAmount)
			.send({ from: root });
		await collateral.methods
			.approve(
				alkemiEarnVerifiedHarness._address,
				liquidationSetup.initialCollateralAmount
			)
			.send({ from: borrower });
		const collateralSupplyResult = await alkemiEarnVerifiedHarness.methods
			.supply(collateral._address, liquidationSetup.initialCollateralAmount)
			.send({ from: borrower });

		// Track and return this so callers can accurately calculate accrued interest on the collateral supply if they so desire.
		const supplyCollateralBlock = collateralSupplyResult.blockNumber;

		const borrowerCollateralBalance = await alkemiEarnVerifiedHarness.methods
			.supplyBalances(borrower, collateral._address)
			.call();
		assert.equal(
			liquidationSetup.initialCollateralAmount,
			borrowerCollateralBalance.principal
		);
		// 10**18 is AlkemiEarnVerified.initialInterestIndex
		assert.equal(10 ** 18, borrowerCollateralBalance.interestIndex);

		// Create the borrow
		const borrowResult = await alkemiEarnVerifiedHarness.methods
			.borrow(borrowed._address, liquidationSetup.initialBorrowAmount)
			.send({ from: borrower });
		// Track and return this so callers can accurately calculate accrued interest on the borrow if they so desire.
		const borrowBlock = borrowResult.blockNumber;
		// Verify that 4 blocks passed between supply of borrowed asset to when it was actually borrowed.
		// We need this for the interestIndex
		assert.equal(borrowBlock - deliverBorrowAssetResult.blockNumber, 4);

		const borrowBalance = await alkemiEarnVerifiedHarness.methods
			.borrowBalances(borrower, borrowed._address)
			.call();
		assert.equal(liquidationSetup.initialBorrowAmount, borrowBalance.principal);
		const expectedInterestIndex = 3 * 10 ** 18; // ((4 blocks * 50%) + 1) * 10**18 (initial interest index)
		assert.equal(borrowBalance.interestIndex, expectedInterestIndex);

		// Set price of collateral to 1:1 (down from 10:1) so borrower has a shortfall
		await alkemiEarnVerifiedHarness.methods
			.harnessSetAssetPrice(collateral._address, 1, 1)
			.send({ from: root });

		return {
			borrower: borrower,
			liquidator: liquidator,
			alkemiEarnVerifiedHarness: alkemiEarnVerifiedHarness,
			collateral: collateral,
			borrowed: borrowed,
			supplyCollateralBlock: supplyCollateralBlock,
			borrowBlock: borrowBlock,
		};
	}

	// This uses harness methods for setup to make it easier to trigger certain error conditions.
	async function setupLiquidationWithHarnessForFailureTest() {
		// borrower supplies OMG and borrows DRGN
		// liquidator repays borrowed loan and seizes collateral collateral
		const borrower = accounts[1];
		const liquidator = accounts[2];
		const alkemiEarnVerifiedHarness =
			await AlkemiEarnVerifiedHarness.new().send({
				from: root,
			});
		await readAndExecContract(alkemiEarnVerifiedHarness, "initializer", [], {
			from: root,
		});
		await readAndExecContract(
			alkemiEarnVerifiedHarness,
			"_changeKYCAdmin",
			[root, true],
			{
				from: root,
			}
		);
		await readAndExecContract(
			alkemiEarnVerifiedHarness,
			"_changeCustomerKYC",
			[borrower, true],
			{
				from: root,
			}
		);
		await readAndExecContract(
			alkemiEarnVerifiedHarness,
			"_changeCustomerKYC",
			[liquidator, true],
			{
				from: root,
			}
		);
		await readAndExecContract(
			alkemiEarnVerifiedHarness,
			"_changeLiquidator",
			[liquidator, true],
			true,
			{
				from: root,
			}
		);
		const collateral = await EIP20.new(
			liquidationSetup.totalTokenAmount,
			"test omg",
			18,
			"omg"
		).send({ from: root });
		const borrowed = await EIP20.new(
			liquidationSetup.totalTokenAmount,
			"test drgn",
			18,
			"drgn"
		).send({ from: root });

		// Support markets
		await alkemiEarnVerifiedHarness.methods
			.harnessSupportMarket(collateral._address)
			.send({ from: root });
		await alkemiEarnVerifiedHarness.methods
			.harnessSupportMarket(borrowed._address)
			.send({ from: root });

		// Add collateral market for omg & drgn
		await alkemiEarnVerifiedHarness.methods
			.harnessAddCollateralMarket(collateral._address)
			.send({ from: root });
		await alkemiEarnVerifiedHarness.methods
			.harnessAddCollateralMarket(borrowed._address)
			.send({ from: root });

		// Set price of collateral to 1:1
		await alkemiEarnVerifiedHarness.methods
			.harnessSetAssetPrice(collateral._address, 1, 1)
			.send({ from: root });

		// Set price of borrowed to 1:1
		await alkemiEarnVerifiedHarness.methods
			.harnessSetAssetPrice(borrowed._address, 1, 1)
			.send({ from: root });

		// Set a required collateral ratio of 2:1
		await alkemiEarnVerifiedHarness.methods
			.harnessSetCollateralRatio(2, 1)
			.send({ from: root });

		// Set up SimpleInterestRateModel for collateral and borrowed market
		const simpleInterestRateModel = await SimpleInterestRateModel.new().send({
			from: root,
		});
		await alkemiEarnVerifiedHarness.methods
			.harnessSetMarketInterestRateModel(
				collateral._address,
				simpleInterestRateModel._address
			)
			.send({ from: root });
		await alkemiEarnVerifiedHarness.methods
			.harnessSetMarketInterestRateModel(
				borrowed._address,
				simpleInterestRateModel._address
			)
			.send({ from: root });

		// Create collateral and borrow balances so that the borrower is underwater.
		// collateral ratio 2:1, prices identical, balances identical, so all of the borrow should be liquidatable
		// collateral omg
		await alkemiEarnVerifiedHarness.methods
			.harnessSetAccountSupplyBalance(
				borrower,
				collateral._address,
				liquidationSetup.initialCollateralAmount,
				1
			)
			.send({ from: root });
		// Borrow drgn
		await alkemiEarnVerifiedHarness.methods
			.harnessSetAccountBorrowBalance(
				borrower,
				borrowed._address,
				liquidationSetup.initialBorrowAmount,
				1
			)
			.send({ from: root });

		// Set market details
		await alkemiEarnVerifiedHarness.methods
			.harnessSetMarketDetails(borrowed._address, 0, 0, 1, 10, 0, 1)
			.send({ from: root });
		await alkemiEarnVerifiedHarness.methods
			.harnessSetMarketDetails(collateral._address, 100, 0, 1, 0, 0, 1)
			.send({ from: root });

		// Give liquidator an approved balance of the borrowed token, borrowed, so he can repay part of the underwater loan
		await borrowed.methods
			.transfer(liquidator, liquidationSetup.initialTokenBalanceLiquidator)
			.send({ gas: tokenTransferGas, from: root });
		await borrowed.methods
			.approve(
				alkemiEarnVerifiedHarness._address,
				liquidationSetup.initialTokenBalanceLiquidator
			)
			.send({ from: liquidator });

		return {
			borrower: borrower,
			liquidator: liquidator,
			alkemiEarnVerifiedHarness: alkemiEarnVerifiedHarness,
			collateral: collateral,
			borrowed: borrowed,
		};
	}

	// Validates info from `setupValidLiquidation` given that the liquidation did NOT occur.
	async function validateFailedLiquidation(
		result,
		alkemiEarnVerifiedHarness,
		borrower,
		borrowed,
		collateral,
		liquidator,
		error,
		failureInfo
	) {
		assert.hasFailure(result, error, failureInfo);

		// Started with 100, should still have 100
		const liquidatorTokenBalance = await borrowed.methods
			.balanceOf(liquidator)
			.call();
		assert.equal(
			liquidationSetup.initialTokenBalanceLiquidator,
			liquidatorTokenBalance
		);

		// No collateral was seized
		const liquidatorCollateralBalance = await alkemiEarnVerifiedHarness.methods
			.supplyBalances(liquidator, collateral._address)
			.call();
		assert.equal(0, liquidatorCollateralBalance.principal);

		const borrowerBorrowBalance = await alkemiEarnVerifiedHarness.methods
			.borrowBalances(borrower, borrowed._address)
			.call();

		assert.equal(
			liquidationSetup.initialBorrowAmount,
			borrowerBorrowBalance.principal
		);

		const borrowerCollateralBalance = await alkemiEarnVerifiedHarness.methods
			.supplyBalances(borrower, collateral._address)
			.call();
		assert.equal(
			liquidationSetup.initialCollateralAmount,
			borrowerCollateralBalance.principal
		);
	}

	async function validateMarket(
		alkemiEarnVerifiedHarness,
		asset,
		prefix,
		expected
	) {
		const market = await alkemiEarnVerifiedHarness.methods
			.markets(asset)
			.call();
		assert.equal(
			market.blockNumber,
			expected.blockNumber,
			`${prefix}: blockNumber`
		);
		assert.equal(
			market.totalSupply,
			expected.totalSupply,
			`${prefix}: totalSupply`
		);
		assert.equal(
			market.supplyRateMantissa,
			expected.supplyRateMantissa,
			`${prefix}: supplyRateMantissa`
		);
		assert.equal(
			market.supplyIndex,
			expected.supplyIndex,
			`${prefix}: supplyIndex`
		);
		assert.equal(
			market.totalBorrows,
			expected.totalBorrows,
			`${prefix}: totalBorrows`
		);
		assert.equal(
			market.borrowRateMantissa,
			expected.borrowRateMantissa,
			`${prefix}: borrowRateMantissa`
		);
		assert.equal(
			market.borrowIndex,
			expected.borrowIndex,
			`${prefix}: borrowIndex`
		);
	}

	const simpleSupplyRateMantissa = 10 ** 17; // SimpleInterestRateModel has fixed supply rate mantissa
	const simpleBorrowRateMantissa = 5 * 10 ** 17; // SimpleInterestRateModel has fixed borrow rate mantissa

	describe("repayBorrow", async () => {
		it("returns error if new borrow rate calculation fails", async () => {
			const alkemiEarnVerifiedHarness =
				await AlkemiEarnVerifiedHarness.new().send({
					from: root,
				});
			await readAndExecContract(alkemiEarnVerifiedHarness, "initializer", [], {
				from: root,
			});
			const customer = accounts[1];
			await readAndExecContract(
				alkemiEarnVerifiedHarness,
				"_changeKYCAdmin",
				[root, true],
				{
					from: root,
				}
			);
			await readAndExecContract(
				alkemiEarnVerifiedHarness,
				"_changeCustomerKYC",
				[customer, true],
				{
					from: root,
				}
			);
			const OMG = await EIP20.new(100, "test omg", 18, "omg").send({
				from: root,
			});

			// Set up FailingInterestModel for OMG market
			const FailableInterestRateModel = getContract(
				"./test/InterestRateModel/FailableInterestRateModel.sol"
			);
			const failableInterestRateModel = await FailableInterestRateModel.new(
				false,
				true
			).send({ from: root });
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketInterestRateModel(
					OMG._address,
					failableInterestRateModel._address
				)
				.send({ from: root });

			// Transfer token (e.g. via ICO) to customer
			await OMG.methods
				.transfer(customer, 100)
				.send({ gas: tokenTransferGas, from: root });

			// Customer now approves our Alkemi Earn Verified to spend its value
			await OMG.methods
				.approve(alkemiEarnVerifiedHarness._address, 95)
				.send({ from: customer });

			// Give user some balance
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountBorrowBalance(customer, OMG._address, 100, 1)
				.send({ from: root });

			// Have sufficient borrows outstanding
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(OMG._address, 0, 0, 1, 100, 0, 1)
				.send({ from: root });

			const result = await alkemiEarnVerifiedHarness.methods
				.repayBorrow(OMG._address, 90)
				.send({ from: customer });

			assert.hasFailure(
				result,
				ErrorEnum.OPAQUE_ERROR,
				FailureInfoEnum.REPAY_BORROW_NEW_BORROW_RATE_CALCULATION_FAILED,
				20
			);
		});

		it("returns error if token transfer fails", async () => {
			const alkemiEarnVerifiedHarness =
				await AlkemiEarnVerifiedHarness.new().send({
					from: root,
				});
			await readAndExecContract(alkemiEarnVerifiedHarness, "initializer", [], {
				from: root,
			});
			const customer = accounts[1];
			await readAndExecContract(
				alkemiEarnVerifiedHarness,
				"_changeKYCAdmin",
				[root, true],
				{
					from: root,
				}
			);
			await readAndExecContract(
				alkemiEarnVerifiedHarness,
				"_changeCustomerKYC",
				[customer, true],
				{
					from: root,
				}
			);
			const OMG = await EIP20.new(100, "test omg", 18, "omg").send({
				from: root,
			});

			// Set up SimpleInterestRateModel for OMG market
			const simpleInterestRateModel = await SimpleInterestRateModel.new().send({
				from: root,
			});
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketInterestRateModel(
					OMG._address,
					simpleInterestRateModel._address
				)
				.send({ from: root });

			// Transfer token (e.g. via ICO) to customer
			await OMG.methods
				.transfer(customer, 100)
				.send({ gas: tokenTransferGas, from: root });

			// Customer now approves our Alkemi Earn Verified to spend its value
			await OMG.methods
				.approve(alkemiEarnVerifiedHarness._address, 95)
				.send({ from: customer });

			// Give user some balance
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountBorrowBalance(customer, OMG._address, 100, 1)
				.send({ from: root });

			// Have sufficient borrows outstanding
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(OMG._address, 0, 0, 1, 100, 0, 1)
				.send({ from: root });

			await OMG.methods
				.harnessSetFailTransferFromAddress(customer, true)
				.send({ from: root });

			const result = await alkemiEarnVerifiedHarness.methods
				.repayBorrow(OMG._address, 90)
				.send({ from: customer });

			assert.hasFailure(
				result,
				ErrorEnum.TOKEN_TRANSFER_FAILED,
				FailureInfoEnum.REPAY_BORROW_TRANSFER_IN_FAILED
			);
		});

		it("reverts if non-standrd token transfer fails", async () => {
			const alkemiEarnVerifiedHarness =
				await AlkemiEarnVerifiedHarness.new().send({
					from: root,
				});
			await readAndExecContract(alkemiEarnVerifiedHarness, "initializer", [], {
				from: root,
			});
			const customer = accounts[1];
			await readAndExecContract(
				alkemiEarnVerifiedHarness,
				"_changeKYCAdmin",
				[root, true],
				{
					from: root,
				}
			);
			await readAndExecContract(
				alkemiEarnVerifiedHarness,
				"_changeCustomerKYC",
				[customer, true],
				{
					from: root,
				}
			);
			const OMG = await EIP20NonStandardThrow.new(
				100,
				"test omg ns",
				18,
				"omg"
			).send({ from: root });

			// Set up SimpleInterestRateModel for OMG market
			const simpleInterestRateModel = await SimpleInterestRateModel.new().send({
				from: root,
			});
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketInterestRateModel(
					OMG._address,
					simpleInterestRateModel._address
				)
				.send({ from: root });

			// Transfer token (e.g. via ICO) to customer
			await OMG.methods
				.transfer(customer, 100)
				.send({ gas: tokenTransferGas, from: root });

			// Customer now approves our Alkemi Earn Verified to spend its value
			await OMG.methods
				.approve(alkemiEarnVerifiedHarness._address, 95)
				.send({ from: customer });

			// Give user some balance
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountBorrowBalance(customer, OMG._address, 100, 1)
				.send({ from: root });

			// Have sufficient borrows outstanding
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(OMG._address, 0, 0, 1, 100, 0, 1)
				.send({ from: root });

			await OMG.methods
				.harnessSetFailTransferFromAddress(customer, true)
				.send({ from: root });

			await assert.revert(
				alkemiEarnVerifiedHarness.methods
					.repayBorrow(OMG._address, 90)
					.send({ from: customer })
			);
		});

		it("emits borrow repaid event on success", async () => {
			const alkemiEarnVerifiedHarness =
				await AlkemiEarnVerifiedHarness.new().send({
					from: root,
				});
			await readAndExecContract(alkemiEarnVerifiedHarness, "initializer", [], {
				from: root,
			});
			const customer = accounts[1];
			await readAndExecContract(
				alkemiEarnVerifiedHarness,
				"_changeKYCAdmin",
				[root, true],
				{
					from: root,
				}
			);
			await readAndExecContract(
				alkemiEarnVerifiedHarness,
				"_changeCustomerKYC",
				[customer, true],
				{
					from: root,
				}
			);
			const OMG = await EIP20.new(100, "test omg", 18, "omg").send({
				from: root,
			});

			// Set up SimpleInterestRateModel for OMG market
			const simpleInterestRateModel = await SimpleInterestRateModel.new().send({
				from: root,
			});
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketInterestRateModel(
					OMG._address,
					simpleInterestRateModel._address
				)
				.send({ from: root });

			// Transfer token (e.g. via ICO) to customer
			await OMG.methods
				.transfer(customer, 100)
				.send({ gas: tokenTransferGas, from: root });

			// Customer now approves our Alkemi Earn Verified to spend its value
			await OMG.methods
				.approve(alkemiEarnVerifiedHarness._address, 95)
				.send({ from: customer });

			// Give user some balance
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountBorrowBalance(customer, OMG._address, 100, 1)
				.send({ from: root });

			// Have sufficient borrows outstanding
			const initialInterestIndex = 1;
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(
					OMG._address,
					0,
					0,
					initialInterestIndex,
					100,
					0,
					initialInterestIndex
				)
				.send({ from: root });
			const result = await alkemiEarnVerifiedHarness.methods
				.repayBorrow(OMG._address, 90)
				.send({ from: customer });

			assert.hasLog(result, "BorrowRepaid", {
				account: checksum(customer),
				asset: OMG._address,
				amount: "90",
				startingBalance: "100",
				newBalance: "10",
			});

			const customerTokenBalance = await OMG.methods.balanceOf(customer).call();
			assert.equal(10, customerTokenBalance);

			const customerCompoundBalance = await alkemiEarnVerifiedHarness.methods
				.borrowBalances(customer, OMG._address)
				.call();
			assert.equal(10, customerCompoundBalance.principal);
			assert.equal(initialInterestIndex, customerCompoundBalance.interestIndex);
		});

		it("allows repay with zero oracle price", async () => {
			const alkemiEarnVerifiedHarness =
				await AlkemiEarnVerifiedHarness.new().send({
					from: root,
				});
			await readAndExecContract(alkemiEarnVerifiedHarness, "initializer", [], {
				from: root,
			});
			const customer = accounts[1];
			await readAndExecContract(
				alkemiEarnVerifiedHarness,
				"_changeKYCAdmin",
				[root, true],
				{
					from: root,
				}
			);
			await readAndExecContract(
				alkemiEarnVerifiedHarness,
				"_changeCustomerKYC",
				[customer, true],
				{
					from: root,
				}
			);
			const OMG = await EIP20.new(100, "test omg", 18, "omg").send({
				from: root,
			});

			// Set up SimpleInterestRateModel for OMG market
			const simpleInterestRateModel = await SimpleInterestRateModel.new().send({
				from: root,
			});
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketInterestRateModel(
					OMG._address,
					simpleInterestRateModel._address
				)
				.send({ from: root });

			// Transfer token (e.g. via ICO) to customer
			await OMG.methods
				.transfer(customer, 100)
				.send({ gas: tokenTransferGas, from: root });

			// Customer now approves our Alkemi Earn Verified to spend its value
			await OMG.methods
				.approve(alkemiEarnVerifiedHarness._address, 95)
				.send({ from: customer });

			// Give user some balance
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountBorrowBalance(customer, OMG._address, 100, 1)
				.send({ from: root });

			// Set oracle price to zero
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPriceMantissa(OMG._address, 0)
				.send({ from: root });

			// Have sufficient borrows outstanding
			const initialInterestIndex = 1;
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(
					OMG._address,
					0,
					0,
					initialInterestIndex,
					100,
					0,
					initialInterestIndex
				)
				.send({ from: root });
			const result = await alkemiEarnVerifiedHarness.methods
				.repayBorrow(OMG._address, 90)
				.send({ from: customer });

			assert.hasLog(result, "BorrowRepaid", {
				account: checksum(customer),
				asset: OMG._address,
				amount: "90",
				startingBalance: "100",
				newBalance: "10",
			});

			const customerTokenBalance = await OMG.methods.balanceOf(customer).call();
			assert.equal(10, customerTokenBalance);

			const customerCompoundBalance = await alkemiEarnVerifiedHarness.methods
				.borrowBalances(customer, OMG._address)
				.call();
			assert.equal(10, customerCompoundBalance.principal);
			assert.equal(initialInterestIndex, customerCompoundBalance.interestIndex);
		});

		it("emits borrow repaid event on non-standard success", async () => {
			const alkemiEarnVerifiedHarness =
				await AlkemiEarnVerifiedHarness.new().send({
					from: root,
				});
			await readAndExecContract(alkemiEarnVerifiedHarness, "initializer", [], {
				from: root,
			});
			const customer = accounts[1];
			await readAndExecContract(
				alkemiEarnVerifiedHarness,
				"_changeKYCAdmin",
				[root, true],
				{
					from: root,
				}
			);
			await readAndExecContract(
				alkemiEarnVerifiedHarness,
				"_changeCustomerKYC",
				[customer, true],
				{
					from: root,
				}
			);
			const OMG = await EIP20NonStandardThrow.new(
				100,
				"test omg ns",
				18,
				"omg"
			).send({ from: root });

			// Set up SimpleInterestRateModel for OMG market
			const simpleInterestRateModel = await SimpleInterestRateModel.new().send({
				from: root,
			});
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketInterestRateModel(
					OMG._address,
					simpleInterestRateModel._address
				)
				.send({ from: root });

			// Transfer token (e.g. via ICO) to customer
			await OMG.methods
				.transfer(customer, 100)
				.send({ gas: tokenTransferGas, from: root });

			// Customer now approves our Alkemi Earn Verified to spend its value
			await OMG.methods
				.approve(alkemiEarnVerifiedHarness._address, 95)
				.send({ from: customer });

			// Give user some balance
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountBorrowBalance(customer, OMG._address, 100, 1)
				.send({ from: root });

			// Have sufficient borrows outstanding
			const initialInterestIndex = 1;
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(
					OMG._address,
					0,
					0,
					initialInterestIndex,
					100,
					0,
					initialInterestIndex
				)
				.send({ from: root });
			const result = await alkemiEarnVerifiedHarness.methods
				.repayBorrow(OMG._address, 90)
				.send({ from: customer });

			assert.hasLog(result, "BorrowRepaid", {
				account: checksum(customer),
				asset: OMG._address,
				amount: "90",
				startingBalance: "100",
				newBalance: "10",
			});

			const customerTokenBalance = await OMG.methods.balanceOf(customer).call();
			assert.equal(10, customerTokenBalance);

			const customerCompoundBalance = await alkemiEarnVerifiedHarness.methods
				.borrowBalances(customer, OMG._address)
				.call();
			assert.equal(10, customerCompoundBalance.principal);
			assert.equal(initialInterestIndex, customerCompoundBalance.interestIndex);
		});

		it("loves @gas", async () => {
			const alkemiEarnVerifiedHarness =
				await AlkemiEarnVerifiedHarness.new().send({
					from: root,
				});
			await readAndExecContract(alkemiEarnVerifiedHarness, "initializer", [], {
				from: root,
			});
			const customer = accounts[1];
			await readAndExecContract(
				alkemiEarnVerifiedHarness,
				"_changeKYCAdmin",
				[root, true],
				{
					from: root,
				}
			);
			await readAndExecContract(
				alkemiEarnVerifiedHarness,
				"_changeCustomerKYC",
				[customer, true],
				{
					from: root,
				}
			);
			const OMG = await EIP20.new(100, "test omg", 18, "omg").send({
				from: root,
			});

			// Set up SimpleInterestRateModel for OMG market
			const simpleInterestRateModel = await SimpleInterestRateModel.new().send({
				from: root,
			});
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketInterestRateModel(
					OMG._address,
					simpleInterestRateModel._address
				)
				.send({ from: root });

			// Transfer token (e.g. via ICO) to customer
			await OMG.methods
				.transfer(customer, 100)
				.send({ gas: tokenTransferGas, from: root });

			// Customer now approves our Alkemi Earn Verified to spend its value
			await OMG.methods
				.approve(alkemiEarnVerifiedHarness._address, 95)
				.send({ from: customer });

			// Give user some balance
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountBorrowBalance(customer, OMG._address, 100, 1)
				.send({ from: root });

			// Have sufficient borrows outstanding
			const initialInterestIndex = 1;
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(
					OMG._address,
					0,
					0,
					initialInterestIndex,
					100,
					0,
					initialInterestIndex
				)
				.send({ from: root });

			// Warm the pot
			await alkemiEarnVerifiedHarness.methods
				.repayBorrow(OMG._address, 1)
				.send({ from: customer });

			const result = await alkemiEarnVerifiedHarness.methods
				.repayBorrow(OMG._address, 90)
				.send({ from: customer });

			assert.hasLog(result, "BorrowRepaid", {
				account: checksum(customer),
				asset: OMG._address,
				amount: "90",
			});

			assert.withinGas(result, 108e3, 5000, "should be about 108K gas", true);
		});

		it("handles special pay max value when customer token balance exceeds borrow balance", async () => {
			const alkemiEarnVerifiedHarness =
				await AlkemiEarnVerifiedHarness.new().send({
					from: root,
				});
			await readAndExecContract(alkemiEarnVerifiedHarness, "initializer", [], {
				from: root,
			});
			const customer = accounts[1];
			await readAndExecContract(
				alkemiEarnVerifiedHarness,
				"_changeKYCAdmin",
				[root, true],
				{
					from: root,
				}
			);
			await readAndExecContract(
				alkemiEarnVerifiedHarness,
				"_changeCustomerKYC",
				[customer, true],
				{
					from: root,
				}
			);
			const OMG = await EIP20.new(100, "test omg", 18, "omg").send({
				from: root,
			});

			// Set up SimpleInterestRateModel for OMG market
			const simpleInterestRateModel = await SimpleInterestRateModel.new().send({
				from: root,
			});
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketInterestRateModel(
					OMG._address,
					simpleInterestRateModel._address
				)
				.send({ from: root });

			// Transfer token (e.g. via ICO) to customer
			await OMG.methods
				.transfer(customer, 100)
				.send({ gas: tokenTransferGas, from: root });

			// Customer now approves our Alkemi Earn Verified to spend its value
			await OMG.methods
				.approve(alkemiEarnVerifiedHarness._address, 95)
				.send({ from: customer });

			// Give user some balance
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountBorrowBalance(customer, OMG._address, 80, 1)
				.send({ from: root });

			// Have sufficient borrows outstanding
			const initialInterestIndex = 1;
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(
					OMG._address,
					0,
					0,
					initialInterestIndex,
					100,
					0,
					initialInterestIndex
				)
				.send({ from: root });
			const result = await alkemiEarnVerifiedHarness.methods
				.repayBorrow(OMG._address, -1)
				.send({ from: customer });

			assert.hasLog(result, "BorrowRepaid", {
				account: checksum(customer),
				asset: OMG._address,
				amount: "80",
				startingBalance: "80",
				newBalance: "0",
			});

			const customerTokenBalance = await OMG.methods.balanceOf(customer).call();
			assert.equal(20, customerTokenBalance);

			const customerCompoundBalance = await alkemiEarnVerifiedHarness.methods
				.borrowBalances(customer, OMG._address)
				.call();
			assert.equal(0, customerCompoundBalance.principal);
			assert.equal(initialInterestIndex, customerCompoundBalance.interestIndex);
		});

		it("handles special pay max value when borrow balance exceeds customer token balance", async () => {
			const alkemiEarnVerifiedHarness =
				await AlkemiEarnVerifiedHarness.new().send({
					from: root,
				});
			await readAndExecContract(alkemiEarnVerifiedHarness, "initializer", [], {
				from: root,
			});
			const customer = accounts[1];
			await readAndExecContract(
				alkemiEarnVerifiedHarness,
				"_changeKYCAdmin",
				[root, true],
				{
					from: root,
				}
			);
			await readAndExecContract(
				alkemiEarnVerifiedHarness,
				"_changeCustomerKYC",
				[customer, true],
				{
					from: root,
				}
			);
			const OMG = await EIP20.new(100, "test omg", 18, "omg").send({
				from: root,
			});

			// Set up SimpleInterestRateModel for OMG market
			const simpleInterestRateModel = await SimpleInterestRateModel.new().send({
				from: root,
			});
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketInterestRateModel(
					OMG._address,
					simpleInterestRateModel._address
				)
				.send({ from: root });

			// Transfer token (e.g. via ICO) to customer
			await OMG.methods
				.transfer(customer, 100)
				.send({ gas: tokenTransferGas, from: root });

			// Customer now approves our Alkemi Earn Verified to spend its value
			await OMG.methods
				.approve(alkemiEarnVerifiedHarness._address, 100)
				.send({ from: customer });

			// Give user some balance
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountBorrowBalance(customer, OMG._address, 120, 1)
				.send({ from: root });

			// Have sufficient borrows outstanding
			const initialInterestIndex = 1;
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(
					OMG._address,
					0,
					0,
					initialInterestIndex,
					100,
					0,
					initialInterestIndex
				)
				.send({ from: root });
			const result = await alkemiEarnVerifiedHarness.methods
				.repayBorrow(OMG._address, -1)
				.send({ from: customer });

			assert.hasLog(result, "BorrowRepaid", {
				account: checksum(customer),
				asset: OMG._address,
				amount: "100",
				startingBalance: "120",
				newBalance: "20",
			});

			const customerTokenBalance = await OMG.methods.balanceOf(customer).call();
			assert.equal(0, customerTokenBalance);

			const customerCompoundBalance = await alkemiEarnVerifiedHarness.methods
				.borrowBalances(customer, OMG._address)
				.call();
			assert.equal(20, customerCompoundBalance.principal);
			assert.equal(initialInterestIndex, customerCompoundBalance.interestIndex);
		});
	});
});
