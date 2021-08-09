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

	describe("borrow", async () => {
		it("returns error and logs info if contract is paused", async () => {
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

			await alkemiEarnVerifiedHarness.methods
				._adminFunctions(root, root, true, 1000000000000000,0)
				.send({ from: root });

			const result = await alkemiEarnVerifiedHarness.methods
				.borrow(OMG._address, 90)
				.send({ from: customer });

			assert.hasFailure(
				result,
				ErrorEnum.CONTRACT_PAUSED,
				FailureInfoEnum.BORROW_CONTRACT_PAUSED
			);
		});

		it("fails if market not supported", async () => {
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

			const result = await alkemiEarnVerifiedHarness.methods
				.borrow(OMG._address, 90)
				.send({ from: customer });

			assert.hasFailure(
				result,
				ErrorEnum.MARKET_NOT_SUPPORTED,
				FailureInfoEnum.BORROW_MARKET_NOT_SUPPORTED
			);
		});

		it("returns error if new supply interest index calculation fails", async () => {
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

			// Support market
			await alkemiEarnVerifiedHarness.methods
				.harnessSupportMarket(OMG._address)
				.send({ from: root });

			// Store a block number that should be HIGHER than the current block number so we'll get an underflow
			// when calculating block delta.
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketBlockNumber(OMG._address, -1)
				.send({ from: root });

			const result = await alkemiEarnVerifiedHarness.methods
				.borrow(OMG._address, 90)
				.send({ from: customer });

			assert.hasFailure(
				result,
				ErrorEnum.INTEGER_UNDERFLOW,
				FailureInfoEnum.BORROW_NEW_BORROW_INDEX_CALCULATION_FAILED
			);
		});

		it("returns error if accumulated balance calculation fails", async () => {
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

			// Support market
			await alkemiEarnVerifiedHarness.methods
				.harnessSupportMarket(OMG._address)
				.send({ from: root });

			// Set zero as the previous supply index for the customer. This should cause div by zero error in balance calc.
			// To reach that we also have to set the previous principal to a non-zero value otherwise we will short circuit.
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountBorrowBalance(customer, OMG._address, 1, 0)
				.send({ from: root });

			const result = await alkemiEarnVerifiedHarness.methods
				.borrow(OMG._address, 90)
				.send({ from: customer });

			assert.hasFailure(
				result,
				ErrorEnum.DIVISION_BY_ZERO,
				FailureInfoEnum.BORROW_ACCUMULATED_BALANCE_CALCULATION_FAILED
			);
		});

		it("returns error if borrow fee calculation fails", async () => {
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

			// Support market
			await alkemiEarnVerifiedHarness.methods
				.harnessSupportMarket(OMG._address)
				.send({ from: root });

			// Set origination fee to 1000%
			await alkemiEarnVerifiedHarness.methods
				._adminFunctions(root, root, false, getExpMantissa(10).toString(10),0)
				.send({ from: root });

			// Borrow max uint, which will overflow with origination fee
			const result = await alkemiEarnVerifiedHarness.methods
				.borrow(OMG._address, bigNums.maxUint.toString(10))
				.send({ from: customer });

			assert.hasFailure(
				result,
				ErrorEnum.INTEGER_OVERFLOW,
				FailureInfoEnum.BORROW_ORIGINATION_FEE_CALCULATION_FAILED
			);
		});

		it("returns error if customer account liquidity calculation fails", async () => {
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
			const OMG = await EIP20.new(
				bigNums.maxUint.toString(10),
				"test omg",
				18,
				"omg"
			).send({
				from: root,
			});

			await alkemiEarnVerifiedHarness.methods
				.harnessSupportMarket(OMG._address)
				.send({ from: root });

			await alkemiEarnVerifiedHarness.methods
				.harnessSetFailLiquidityCheck(customer, true)
				.send({ from: root });

			const result = await alkemiEarnVerifiedHarness.methods
				.borrow(OMG._address, 1)
				.send({ from: customer });

			assert.hasFailure(
				result,
				ErrorEnum.INTEGER_OVERFLOW,
				FailureInfoEnum.BORROW_ACCOUNT_LIQUIDITY_CALCULATION_FAILED
			);
		});

		it("returns an error if borrow amount value calcuation fails", async () => {
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

			// Support market
			await alkemiEarnVerifiedHarness.methods
				.harnessSupportMarket(OMG._address)
				.send({ from: root });

			// Set origination fee to 0%
			await alkemiEarnVerifiedHarness.methods
				._adminFunctions(root, root, false, getExpMantissa(0),0)
				.send({ from: root });

			// Set price of OMG to 10:1
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPrice(OMG._address, 10, 1)
				.send({ from: root });

			// Borrow max uint, which will overflow borrow amount
			const result = await alkemiEarnVerifiedHarness.methods
				.borrow(OMG._address, bigNums.maxUint.toString(10))
				.send({ from: customer });

			assert.hasFailure(
				result,
				ErrorEnum.INTEGER_OVERFLOW,
				FailureInfoEnum.BORROW_AMOUNT_VALUE_CALCULATION_FAILED
			);
		});

		it("fails with liquidity shortfall present", async () => {
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

			// Support market
			await alkemiEarnVerifiedHarness.methods
				.harnessSupportMarket(OMG._address)
				.send({ from: root });

			// Set origination fee to 0%
			await alkemiEarnVerifiedHarness.methods
				._adminFunctions(root, root, false, getExpMantissa(0),0)
				.send({ from: root });

			// Set price of OMG to 1:1
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPrice(OMG._address, 1, 1)
				.send({ from: root });

			// Set a required collateral ratio of 2:1
			await alkemiEarnVerifiedHarness.methods
				.harnessSetCollateralRatio(2, 1)
				.send({ from: root });

			// Set a shortfall
			await alkemiEarnVerifiedHarness.methods
				.harnessSetLiquidityShortfall(customer, 100)
				.send({ from: root });

			// Try to borrow when account has shortfall
			const result = await alkemiEarnVerifiedHarness.methods
				.borrow(OMG._address, 5)
				.send({ from: customer });

			assert.hasFailure(
				result,
				ErrorEnum.INSUFFICIENT_LIQUIDITY,
				FailureInfoEnum.BORROW_ACCOUNT_SHORTFALL_PRESENT
			);
		});

		it("fails with liquidity shortfall present sans harness", async () => {
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
			const DRGN = await EIP20.new(100, "test drgn", 18, "drgn").send({
				from: root,
			});

			// Support market
			await alkemiEarnVerifiedHarness.methods
				.harnessSupportMarket(OMG._address)
				.send({ from: root });

			// Add collateral market for drgn to get shortfall
			await alkemiEarnVerifiedHarness.methods
				.harnessAddCollateralMarket(DRGN._address)
				.send({ from: root });

			// Set origination fee to 0%
			await alkemiEarnVerifiedHarness.methods
				._adminFunctions(root, root, false, getExpMantissa(0),0)
				.send({ from: root });

			// Set price of OMG to 1:1
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPrice(OMG._address, 1, 1)
				.send({ from: root });

			// Set price of DRGN to 1:1
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPrice(DRGN._address, 1, 1)
				.send({ from: root });

			// Set a required collateral ratio of 2:1
			await alkemiEarnVerifiedHarness.methods
				.harnessSetCollateralRatio(2, 1)
				.send({ from: root });

			// Borrow drgn
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountBorrowBalance(customer, DRGN._address, 10, 1)
				.send({ from: root });

			// Set market details
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(DRGN._address, 0, 0, 1, 0, 0, 1)
				.send({ from: root });

			// Try to borrow when account has shortfall
			const result = await alkemiEarnVerifiedHarness.methods
				.borrow(OMG._address, 5)
				.send({ from: customer });

			assert.hasFailure(
				result,
				ErrorEnum.INSUFFICIENT_LIQUIDITY,
				FailureInfoEnum.BORROW_ACCOUNT_SHORTFALL_PRESENT
			);
		});

		it("fails with insufficient liquidity", async () => {
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

			// Support market
			await alkemiEarnVerifiedHarness.methods
				.harnessSupportMarket(OMG._address)
				.send({ from: root });

			// Set origination fee to 0%
			await alkemiEarnVerifiedHarness.methods
				._adminFunctions(root, root, false, getExpMantissa(0),0)
				.send({ from: root });

			// Set price of OMG to 1:1
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPrice(OMG._address, 1, 1)
				.send({ from: root });

			await alkemiEarnVerifiedHarness.methods
				.harnessSetCollateralRatio(2, 1)
				.send({ from: root });

			// Try to borrow when account has insufficient liquidity
			const result = await alkemiEarnVerifiedHarness.methods
				.borrow(OMG._address, 5)
				.send({ from: customer });

			assert.hasFailure(
				result,
				ErrorEnum.INSUFFICIENT_LIQUIDITY,
				FailureInfoEnum.BORROW_AMOUNT_LIQUIDITY_SHORTFALL
			);
		});

		it("returns error if customer total new balance calculation fails", async () => {
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
			const OMG = await EIP20.new(
				bigNums.maxUint.toString(10),
				"test omg",
				18,
				"omg"
			).send({
				from: root,
			});

			// Support market
			await alkemiEarnVerifiedHarness.methods
				.harnessSupportMarket(OMG._address)
				.send({ from: root });

			// Set price of OMG to 1:1
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPrice(OMG._address, 1, 1)
				.send({ from: root });

			// Clear out collateral ratio so user can borrow
			await alkemiEarnVerifiedHarness.methods
				.harnessSetCollateralRatio(0, 1)
				.send({ from: root });

			// We are going to borrow 1, so give an existing balance of maxUint to cause an overflow.
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountBorrowBalance(
					customer,
					OMG._address,
					bigNums.maxUint.toString(10),
					1
				)
				.send({ from: root });

			// Set market details
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(OMG._address, 0, 0, 1, 0, 0, 1)
				.send({ from: root });

			const result = await alkemiEarnVerifiedHarness.methods
				.borrow(OMG._address, 1)
				.send({ from: customer });

			assert.hasFailure(
				result,
				ErrorEnum.INTEGER_OVERFLOW,
				FailureInfoEnum.BORROW_NEW_TOTAL_BALANCE_CALCULATION_FAILED
			);
		});

		it("returns error if protocol total borrow calculation fails via underflow", async () => {
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
			const OMG = await EIP20.new(
				bigNums.maxUint.toString(10),
				"test omg",
				18,
				"omg"
			).send({
				from: root,
			});

			// Support market
			await alkemiEarnVerifiedHarness.methods
				.harnessSupportMarket(OMG._address)
				.send({ from: root });

			// Set price of OMG to 1:1
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPrice(OMG._address, 1, 1)
				.send({ from: root });

			// Clear out collateral ratio so user can borrow
			await alkemiEarnVerifiedHarness.methods
				.harnessSetCollateralRatio(0, 1)
				.send({ from: root });

			// We are going to borrow 1, so give an existing balance of maxUint to cause an overflow.
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountBorrowBalance(
					customer,
					OMG._address,
					bigNums.maxUint.toString(10),
					1
				)
				.send({ from: root });

			const result = await alkemiEarnVerifiedHarness.methods
				.borrow(OMG._address, 1)
				.send({ from: customer });

			assert.hasFailure(
				result,
				ErrorEnum.INTEGER_UNDERFLOW, // shouldn't this be overflow?
				FailureInfoEnum.BORROW_NEW_TOTAL_BORROW_CALCULATION_FAILED
			);
		});

		it("returns error if protocol total borrow calculation fails", async () => {
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

			// Support market
			await alkemiEarnVerifiedHarness.methods
				.harnessSupportMarket(OMG._address)
				.send({ from: root });

			// Set price of OMG to 1:1
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPrice(OMG._address, 1, 1)
				.send({ from: root });

			// Clear out collateral ratio so user can borrow
			await alkemiEarnVerifiedHarness.methods
				.harnessSetCollateralRatio(0, 1)
				.send({ from: root });

			// Give the protocol a token balance of maxUint so when we calculate adding the new supply to it, it will overflow.
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(
					OMG._address,
					0,
					0,
					1,
					bigNums.maxUint.toString(10),
					0,
					1
				)
				.send({ from: root });

			const result = await alkemiEarnVerifiedHarness.methods
				.borrow(OMG._address, 1)
				.send({ from: customer });

			assert.hasFailure(
				result,
				ErrorEnum.INTEGER_OVERFLOW,
				FailureInfoEnum.BORROW_NEW_TOTAL_BORROW_CALCULATION_FAILED
			);
		});

		it("returns error if protocol total cash calculation fails", async () => {
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
			const OMG = await EIP20.new(
				bigNums.maxUint.toString(10),
				"test omg",
				18,
				"omg"
			).send({
				from: root,
			});

			// Support market
			await alkemiEarnVerifiedHarness.methods
				.harnessSupportMarket(OMG._address)
				.send({ from: root });

			// Set price of OMG to 1:1
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPrice(OMG._address, 1, 1)
				.send({ from: root });

			// Clear out collateral ratio so user can borrow
			await alkemiEarnVerifiedHarness.methods
				.harnessSetCollateralRatio(0, 1)
				.send({ from: root });

			// Give the protocol a token balance of maxUint so when we calculate adding the new supply to it, it will overflow.
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(OMG._address, 0, 0, 1, 0, 0, 1)
				.send({ from: root });

			// We are going to borrow 1, so fake out protocol current cash as 0 so when we sub the new cash it will underflow.
			await alkemiEarnVerifiedHarness.methods
				.harnessSetCash(OMG._address, 0)
				.send({ from: root });

			const result = await alkemiEarnVerifiedHarness.methods
				.borrow(OMG._address, 1)
				.send({ from: customer });

			assert.hasFailure(
				result,
				ErrorEnum.TOKEN_INSUFFICIENT_CASH,
				FailureInfoEnum.BORROW_NEW_TOTAL_CASH_CALCULATION_FAILED
			);
		});
	});
});
