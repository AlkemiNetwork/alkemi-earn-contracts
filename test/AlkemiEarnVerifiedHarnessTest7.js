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

	describe("liquidateBorrow", async () => {
		it("returns error and logs info if contract is paused", async () => {
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
				supplyCollateralBlock,
				borrowBlock,
			} = await setupValidLiquidation();

			await alkemiEarnVerifiedHarness.methods
				._adminFunctions(root, root, true, 1000000000000000,0,root,root)
				.send({ from: root });

			const liquidateResult = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 6)
				.send({ from: liquidator });

			assert.hasFailure(
				liquidateResult,
				ErrorEnum.CONTRACT_PAUSED,
				FailureInfoEnum.LIQUIDATE_CONTRACT_PAUSED
			);
		});

		it("handles a valid liquidation", async () => {
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
				supplyCollateralBlock,
				borrowBlock,
			} = await setupValidLiquidation();

			/////////// Call function.  All could be liquidated, but let's only liquidate some of it.
			const liquidateResult = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 6)
				.send({ from: liquidator });

			/////////// Validate
			// First let's make sure the environment is setup as we expected; otherwise we might get a successful test for the wrong reason.
			// We expect 3 blocks of supply interest at 10% per block, so make sure 3 blocks have passed since the supply of collateral was received.
			// 3 blocks comes from 2 blocks in setupValidLiquidation() and then 1 block here to do the liquidation.
			assert.equal(supplyCollateralBlock + 3, liquidateResult.blockNumber);

			// We expect 2 blocks of borrow interest at 50% per block so make sure 2 blocks have passed since the borrow was created.
			// 2 blocks comes from 1 block in setupValidLiquidation() and then 1 block here to do the liquidation.
			assert.equal(borrowBlock + 2, liquidateResult.blockNumber);

			const expectedAccumulatedBorrowBalance_TargetUserBorrowed = 20; // 10 + ( 2 blocks * 50%/block * 10) = 10 + 10 = 20
			const expectedAmountRepaid = 6;
			const expectedBorrowBalanceAfter_TargetUserBorrowed =
				expectedAccumulatedBorrowBalance_TargetUserBorrowed -
				expectedAmountRepaid;

			const expectedAccumulatedSupplyBalance_TargetUserCollateral = 13; // 10 + (3 blocks * 10%/block * 10) = 10 + 3 = 13
			const expectedSupplyIndex_Collateral = 1.3 * 10 ** 18; // ((3 blocks * 10%) + 1) * 10**18 (initial interest index)
			const expectedAmountSeized = 6;
			const expectedSupplyBalanceAfter_TargetUserCollateral =
				expectedAccumulatedSupplyBalance_TargetUserCollateral -
				expectedAmountSeized;

			assert.hasLog(liquidateResult, "BorrowLiquidated", {
				targetAccount: checksum(borrower),
				assetBorrow: borrowed._address,
				borrowBalanceBefore: liquidationSetup.initialBorrowAmount.toString(),
				borrowBalanceAccumulated:
					expectedAccumulatedBorrowBalance_TargetUserBorrowed.toString(),
				amountRepaid: expectedAmountRepaid.toString(),
				borrowBalanceAfter:
					expectedBorrowBalanceAfter_TargetUserBorrowed.toString(),
				liquidator: checksum(liquidator),
				assetCollateral: collateral._address,
				collateralBalanceBefore:
					liquidationSetup.initialCollateralAmount.toString(),
				collateralBalanceAccumulated:
					expectedAccumulatedSupplyBalance_TargetUserCollateral.toString(),
				amountSeized: expectedAmountSeized.toString(),
				collateralBalanceAfter:
					expectedSupplyBalanceAfter_TargetUserCollateral.toString(),
			});

			// Liquidator's off-protocol token balance should have declined by the amount used to reduce the target user's borrow
			const liquidatorTokenBalance = await borrowed.methods
				.balanceOf(liquidator)
				.call();
			assert.equal(
				liquidatorTokenBalance,
				liquidationSetup.initialTokenBalanceLiquidator - expectedAmountRepaid
			);

			// Seized collateral goes to the liquidator's protocol account
			const liquidatorCollateralBalance =
				await alkemiEarnVerifiedHarness.methods
					.supplyBalances(liquidator, collateral._address)
					.call();
			assert.equal(liquidatorCollateralBalance.principal, expectedAmountSeized);
			assert.equal(
				liquidatorCollateralBalance.interestIndex,
				expectedSupplyIndex_Collateral
			);

			const borrowerBorrowBalance = await alkemiEarnVerifiedHarness.methods
				.borrowBalances(borrower, borrowed._address)
				.call();
			assert.equal(
				borrowerBorrowBalance.principal,
				expectedBorrowBalanceAfter_TargetUserBorrowed
			);
			const expectedBorrowIndexBorrowedAsset = 6 * 10 ** 18; //  ((2 blocks * 50%) + 1) * (3 * 10**18) (previous interest index)
			assert.equal(
				borrowerBorrowBalance.interestIndex,
				expectedBorrowIndexBorrowedAsset
			);

			const borrowerCollateralBalance = await alkemiEarnVerifiedHarness.methods
				.supplyBalances(borrower, collateral._address)
				.call();
			assert.equal(
				borrowerCollateralBalance.principal,
				expectedSupplyBalanceAfter_TargetUserCollateral
			);
			assert.equal(
				borrowerCollateralBalance.interestIndex,
				expectedSupplyIndex_Collateral
			);

			await validateMarket(
				alkemiEarnVerifiedHarness,
				borrowed._address,
				"handles a valid liquidation: borrowed",
				{
					blockNumber: liquidateResult.blockNumber,
					totalSupply: liquidationSetup.initialTokenBalanceOtherSupplier,
					supplyRateMantissa: simpleSupplyRateMantissa,
					supplyIndex: 1.4 * 1.2 * 10 ** 18, // initial 10e18, multiplied by (1 + 4 * 0.1) at borrow and then (1 + 2 * 0.1) at liquidate
					totalBorrows: expectedBorrowBalanceAfter_TargetUserBorrowed,
					borrowRateMantissa: simpleBorrowRateMantissa,
					borrowIndex: expectedBorrowIndexBorrowedAsset,
				}
			);

			await validateMarket(
				alkemiEarnVerifiedHarness,
				collateral._address,
				"handles a valid liquidation: collateral",
				{
					blockNumber: liquidateResult.blockNumber,
					totalSupply: expectedAccumulatedSupplyBalance_TargetUserCollateral, // though now it is split across target user and liquidator
					supplyRateMantissa: simpleSupplyRateMantissa,
					supplyIndex: expectedSupplyIndex_Collateral,
					totalBorrows: 0,
					borrowRateMantissa: simpleBorrowRateMantissa,
					borrowIndex: 2.5 * 10 ** 18, // initial 10e18 when supplied, multiplied by (1 + 3*0.5) at liquidate
				}
			);
		});

		it("handles a valid non-standard liquidation", async () => {
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
				supplyCollateralBlock,
				borrowBlock,
			} = await setupValidLiquidation(true);

			/////////// Call function.  All could be liquidated, but let's only liquidate some of it.
			const liquidateResult = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 6)
				.send({ from: liquidator });

			/////////// Validate
			// First let's make sure the environment is setup as we expected; otherwise we might get a successful test for the wrong reason.
			// We expect 3 blocks of supply interest at 10% per block, so make sure 3 blocks have passed since the supply of collateral was received.
			// 3 blocks comes from 2 blocks in setupValidLiquidation() and then 1 block here to do the liquidation.
			assert.equal(supplyCollateralBlock + 3, liquidateResult.blockNumber);

			// We expect 2 blocks of borrow interest at 50% per block so make sure 2 blocks have passed since the borrow was created.
			// 2 blocks comes from 1 block in setupValidLiquidation() and then 1 block here to do the liquidation.
			assert.equal(borrowBlock + 2, liquidateResult.blockNumber);

			const expectedAccumulatedBorrowBalance_TargetUserBorrowed = 20; // 10 + ( 2 blocks * 50%/block * 10) = 10 + 10 = 20
			const expectedAmountRepaid = 6;
			const expectedBorrowBalanceAfter_TargetUserBorrowed =
				expectedAccumulatedBorrowBalance_TargetUserBorrowed -
				expectedAmountRepaid;

			const expectedAccumulatedSupplyBalance_TargetUserCollateral = 13; // 10 + (3 blocks * 10%/block * 10) = 10 + 3 = 13
			const expectedSupplyIndex_Collateral = 1.3 * 10 ** 18; // ((3 blocks * 10%) + 1) * 10**18 (initial interest index)
			const expectedAmountSeized = 6;
			const expectedSupplyBalanceAfter_TargetUserCollateral =
				expectedAccumulatedSupplyBalance_TargetUserCollateral -
				expectedAmountSeized;

			assert.hasLog(liquidateResult, "BorrowLiquidated", {
				targetAccount: checksum(borrower),
				assetBorrow: borrowed._address,
				borrowBalanceBefore: liquidationSetup.initialBorrowAmount.toString(),
				borrowBalanceAccumulated:
					expectedAccumulatedBorrowBalance_TargetUserBorrowed.toString(),
				amountRepaid: expectedAmountRepaid.toString(),
				borrowBalanceAfter:
					expectedBorrowBalanceAfter_TargetUserBorrowed.toString(),
				liquidator: checksum(liquidator),
				assetCollateral: collateral._address,
				collateralBalanceBefore:
					liquidationSetup.initialCollateralAmount.toString(),
				collateralBalanceAccumulated:
					expectedAccumulatedSupplyBalance_TargetUserCollateral.toString(),
				amountSeized: expectedAmountSeized.toString(),
				collateralBalanceAfter:
					expectedSupplyBalanceAfter_TargetUserCollateral.toString(),
			});

			// Liquidator's off-protocol token balance should have declined by the amount used to reduce the target user's borrow
			const liquidatorTokenBalance = await borrowed.methods
				.balanceOf(liquidator)
				.call();
			assert.equal(
				liquidatorTokenBalance,
				liquidationSetup.initialTokenBalanceLiquidator - expectedAmountRepaid
			);

			// Seized collateral goes to the liquidator's protocol account
			const liquidatorCollateralBalance =
				await alkemiEarnVerifiedHarness.methods
					.supplyBalances(liquidator, collateral._address)
					.call();
			assert.equal(liquidatorCollateralBalance.principal, expectedAmountSeized);
			assert.equal(
				liquidatorCollateralBalance.interestIndex,
				expectedSupplyIndex_Collateral
			);

			const borrowerBorrowBalance = await alkemiEarnVerifiedHarness.methods
				.borrowBalances(borrower, borrowed._address)
				.call();
			assert.equal(
				borrowerBorrowBalance.principal,
				expectedBorrowBalanceAfter_TargetUserBorrowed
			);
			const expectedBorrowIndexBorrowedAsset = 6 * 10 ** 18; //  ((2 blocks * 50%) + 1) * (3 * 10**18) (previous interest index)
			assert.equal(
				borrowerBorrowBalance.interestIndex,
				expectedBorrowIndexBorrowedAsset
			);

			const borrowerCollateralBalance = await alkemiEarnVerifiedHarness.methods
				.supplyBalances(borrower, collateral._address)
				.call();
			assert.equal(
				borrowerCollateralBalance.principal,
				expectedSupplyBalanceAfter_TargetUserCollateral
			);
			assert.equal(
				borrowerCollateralBalance.interestIndex,
				expectedSupplyIndex_Collateral
			);

			await validateMarket(
				alkemiEarnVerifiedHarness,
				borrowed._address,
				"handles a valid liquidation: borrowed",
				{
					blockNumber: liquidateResult.blockNumber,
					totalSupply: liquidationSetup.initialTokenBalanceOtherSupplier,
					supplyRateMantissa: simpleSupplyRateMantissa,
					supplyIndex: 1.4 * 1.2 * 10 ** 18, // initial 10e18, multiplied by (1 + 4 * 0.1) at borrow and then (1 + 2 * 0.1) at liquidate
					totalBorrows: expectedBorrowBalanceAfter_TargetUserBorrowed,
					borrowRateMantissa: simpleBorrowRateMantissa,
					borrowIndex: expectedBorrowIndexBorrowedAsset,
				}
			);

			await validateMarket(
				alkemiEarnVerifiedHarness,
				collateral._address,
				"handles a valid liquidation: collateral",
				{
					blockNumber: liquidateResult.blockNumber,
					totalSupply: expectedAccumulatedSupplyBalance_TargetUserCollateral, // though now it is split across target user and liquidator
					supplyRateMantissa: simpleSupplyRateMantissa,
					supplyIndex: expectedSupplyIndex_Collateral,
					totalBorrows: 0,
					borrowRateMantissa: simpleBorrowRateMantissa,
					borrowIndex: 2.5 * 10 ** 18, // initial 10e18 when supplied, multiplied by (1 + 3*0.5) at liquidate
				}
			);
		});

		it("handles max for a supported market", async () => {
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
				supplyCollateralBlock,
				borrowBlock,
			} = await setupValidLiquidation();

			/////////// Call function.  liquidate max by specifying -1
			const liquidateResult = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, -1)
				.send({ from: liquidator });

			/////////// Validate
			// First let's make sure the environment is setup as we expected; otherwise we might get a successful test for the wrong reason.
			// We expect 3 blocks of supply interest at 10% per block, so make sure 3 blocks have passed since the supply of collateral was received.
			// 3 blocks comes from 2 blocks in setupValidLiquidation() and then 1 block here to do the liquidation.
			assert.equal(supplyCollateralBlock + 3, liquidateResult.blockNumber);

			// We expect 2 blocks of borrow interest at 50% per block so make sure 2 blocks have passed since the borrow was created.
			// 2 blocks comes from 1 block in setupValidLiquidation() and then 1 block here to do the liquidation.
			assert.equal(borrowBlock + 2, liquidateResult.blockNumber);

			const expectedAccumulatedBorrowBalance_TargetUserBorrowed = 20; // 10 + ( 2 blocks * 50%/block * 10) = 10 + 10 = 20;
			const expectedAmountRepaid = 11; // We could close the entire accrued borrow of 20 but there's only 13 of the collateral.
			const expectedBorrowBalanceAfter_TargetUserBorrowed =
				expectedAccumulatedBorrowBalance_TargetUserBorrowed -
				expectedAmountRepaid;

			const expectedAccumulatedSupplyBalance_TargetUserCollateral = 13; // 10 + (3 blocks * 10%/block * 10 = 10 + 3 = 13;
			const expectedSupplyIndex_Collateral = 1.3 * 10 ** 18; // ((3 blocks * 10%) + 1) * 10**18 (initial interest index)
			const expectedShortfall = 27; // (2 * 20) - 13 = 40 - 13 = 27;
			// Recall that we have borrow asset and collateral asset at the same price.
			const expectedAmountSeized = 12; // See comment re expectedAmountRepaid
			const expectedSupplyBalanceAfter_TargetUserCollateral =
				expectedAccumulatedSupplyBalance_TargetUserCollateral -
				expectedAmountSeized; // See comment re expectedAmountRepaid

			assert.hasLog(liquidateResult, "BorrowLiquidated", {
				targetAccount: checksum(borrower),
				assetBorrow: borrowed._address,
				borrowBalanceBefore: liquidationSetup.initialBorrowAmount.toString(),
				borrowBalanceAccumulated:
					expectedAccumulatedBorrowBalance_TargetUserBorrowed.toString(),
				amountRepaid: expectedAmountRepaid.toString(),
				borrowBalanceAfter:
					expectedBorrowBalanceAfter_TargetUserBorrowed.toString(),
				liquidator: checksum(liquidator),
				assetCollateral: collateral._address,
				collateralBalanceBefore:
					liquidationSetup.initialCollateralAmount.toString(),
				collateralBalanceAccumulated:
					expectedAccumulatedSupplyBalance_TargetUserCollateral.toString(),
				amountSeized: expectedAmountSeized.toString(),
				collateralBalanceAfter:
					expectedSupplyBalanceAfter_TargetUserCollateral.toString(),
			});

			// Liquidator's off-protocol token balance should have declined by the amount used to reduce the target user's borrow
			const liquidatorTokenBalance = await borrowed.methods
				.balanceOf(liquidator)
				.call();
			assert.equal(
				liquidatorTokenBalance,
				liquidationSetup.initialTokenBalanceLiquidator - expectedAmountRepaid
			);

			// Seized collateral goes to the liquidator's protocol account
			const liquidatorCollateralBalance =
				await alkemiEarnVerifiedHarness.methods
					.supplyBalances(liquidator, collateral._address)
					.call();
			assert.equal(liquidatorCollateralBalance.principal, expectedAmountSeized);
			assert.equal(
				liquidatorCollateralBalance.interestIndex,
				expectedSupplyIndex_Collateral
			);

			const borrowerBorrowBalance = await alkemiEarnVerifiedHarness.methods
				.borrowBalances(borrower, borrowed._address)
				.call();
			assert.equal(
				borrowerBorrowBalance.principal,
				expectedBorrowBalanceAfter_TargetUserBorrowed
			);
			const expectedBorrowIndexBorrowedAsset = 6 * 10 ** 18; // ((2 blocks * 50%) + 1) * (3 * 10**18) (previous interest index)
			assert.equal(
				borrowerBorrowBalance.interestIndex,
				expectedBorrowIndexBorrowedAsset
			);

			const borrowerCollateralBalance = await alkemiEarnVerifiedHarness.methods
				.supplyBalances(borrower, collateral._address)
				.call();
			assert.equal(
				borrowerCollateralBalance.principal,
				expectedSupplyBalanceAfter_TargetUserCollateral
			);
			assert.equal(
				borrowerCollateralBalance.interestIndex,
				expectedSupplyIndex_Collateral
			);

			await validateMarket(
				alkemiEarnVerifiedHarness,
				borrowed._address,
				"handles max for a supported market: borrowed",
				{
					blockNumber: liquidateResult.blockNumber,
					totalSupply: liquidationSetup.initialTokenBalanceOtherSupplier,
					supplyRateMantissa: simpleSupplyRateMantissa,
					supplyIndex: 1.4 * 1.2 * 10 ** 18, // initial 10e18, multiplied by (1 + 4 * 0.1) at borrow and then (1 + 2 * 0.1) at liquidate
					totalBorrows: expectedBorrowBalanceAfter_TargetUserBorrowed,
					borrowRateMantissa: simpleBorrowRateMantissa,
					borrowIndex: expectedBorrowIndexBorrowedAsset,
				}
			);

			await validateMarket(
				alkemiEarnVerifiedHarness,
				collateral._address,
				"handles max for a supported market: collateral",
				{
					blockNumber: liquidateResult.blockNumber,
					totalSupply: expectedAccumulatedSupplyBalance_TargetUserCollateral, // though now it is split across target user and liquidator
					supplyRateMantissa: simpleSupplyRateMantissa,
					supplyIndex: expectedSupplyIndex_Collateral,
					totalBorrows: 0,
					borrowRateMantissa: simpleBorrowRateMantissa,
					borrowIndex: 2.5 * 10 ** 18, // initial 10e18 when supplied, multiplied by (1 + 3*0.5) at liquidate
				}
			);
		});

		it("handles max for an unsupported market", async () => {
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
				supplyCollateralBlock,
				borrowBlock,
			} = await setupValidLiquidation();
			// Set market to unsupported
			await alkemiEarnVerifiedHarness.methods
				.harnessUnsupportMarket(borrowed._address)
				.send({ from: root });
			// Make borrower's collateral more valuable, so if the market were supported, the borrow would not be eligible for liquidation.
			// Set price of collateral to 3:1
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPrice(collateral._address, 3, 1)
				.send({ from: root });

			/////////// Call function.  liquidate max by specifying -1
			const liquidateResult = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, -1)
				.send({ from: liquidator });

			/////////// Validate
			// First let's make sure the environment is setup as we expected; otherwise we might get a successful test for the wrong reason.
			// We expect 5 blocks of supply interest at 10% per block, so make sure 5 blocks have passed since the supply of collateral was received.
			// 5 blocks comes from 2 blocks in setupValidLiquidation() and then 3 blocks here to unsupport market, change price, and do liquidation.
			assert.equal(supplyCollateralBlock + 5, liquidateResult.blockNumber);

			// We expect 4 blocks of borrow interest at 50% per block so make sure 4 blocks have passed since the borrow was created.
			// 4 blocks comes from 1 block in setupValidLiquidation() and then 3 blocks here to unsupport market, change price, and do liquidation.
			assert.equal(borrowBlock + 4, liquidateResult.blockNumber);

			const expectedAccumulatedBorrowBalance_TargetUserBorrowed = 30; // 10 + (4 blocks * 50% per block * 10) = 10 + 20 = 30
			const expectedAmountRepaid = 30; // We expect all of the unsupported asset to be repaid
			const expectedBorrowBalanceAfter_TargetUserBorrowed =
				expectedAccumulatedBorrowBalance_TargetUserBorrowed -
				expectedAmountRepaid;

			const expectedAccumulatedSupplyBalance_TargetUserCollateral = 15; // 10 + (5 blocks * 10%/block * 10) = 10 + 5 = 15
			const expectedSupplyIndex_Collateral = 1.5 * 10 ** 18; // ((5 blocks * 10%) + 1) * 10**18 (initial interest index)
			const expectedAmountSeized = 11; // min(15 accrued, 10 derived from borrow) (30 borrow/ 3 collateral to borrow price ratio) = 10
			const expectedSupplyBalanceAfter_TargetUserCollateral =
				expectedAccumulatedSupplyBalance_TargetUserCollateral -
				expectedAmountSeized;

			assert.hasLog(liquidateResult, "BorrowLiquidated", {
				targetAccount: checksum(borrower),
				assetBorrow: borrowed._address,
				borrowBalanceBefore: liquidationSetup.initialBorrowAmount.toString(),
				borrowBalanceAccumulated:
					expectedAccumulatedBorrowBalance_TargetUserBorrowed.toString(),
				amountRepaid: expectedAmountRepaid.toString(),
				borrowBalanceAfter:
					expectedBorrowBalanceAfter_TargetUserBorrowed.toString(),
				liquidator: checksum(liquidator),
				assetCollateral: collateral._address,
				collateralBalanceBefore:
					liquidationSetup.initialCollateralAmount.toString(),
				collateralBalanceAccumulated:
					expectedAccumulatedSupplyBalance_TargetUserCollateral.toString(),
				amountSeized: expectedAmountSeized.toString(),
				collateralBalanceAfter:
					expectedSupplyBalanceAfter_TargetUserCollateral.toString(),
			});

			// Liquidator's off-protocol token balance should have declined by the amount used to reduce the target user's borrow
			const liquidatorTokenBalance = await borrowed.methods
				.balanceOf(liquidator)
				.call();
			assert.equal(
				liquidatorTokenBalance,
				liquidationSetup.initialTokenBalanceLiquidator - expectedAmountRepaid
			);

			// Seized collateral goes to the liquidator's protocol account
			const liquidatorCollateralBalance =
				await alkemiEarnVerifiedHarness.methods
					.supplyBalances(liquidator, collateral._address)
					.call();
			assert.equal(liquidatorCollateralBalance.principal, expectedAmountSeized);
			assert.equal(
				liquidatorCollateralBalance.interestIndex,
				expectedSupplyIndex_Collateral
			);

			const borrowerBorrowBalance = await alkemiEarnVerifiedHarness.methods
				.borrowBalances(borrower, borrowed._address)
				.call();
			assert.equal(
				borrowerBorrowBalance.principal,
				expectedBorrowBalanceAfter_TargetUserBorrowed
			);

			const expectedBorrowIndexBorrowedAsset = 9 * 10 ** 18; // ((4 blocks * 50%) + 1) * (3 * 10**18) (previous interest index)
			assert.equal(
				borrowerBorrowBalance.interestIndex,
				expectedBorrowIndexBorrowedAsset
			);

			const borrowerCollateralBalance = await alkemiEarnVerifiedHarness.methods
				.supplyBalances(borrower, collateral._address)
				.call();
			assert.equal(
				borrowerCollateralBalance.principal,
				expectedSupplyBalanceAfter_TargetUserCollateral
			);
			assert.equal(
				borrowerCollateralBalance.interestIndex,
				expectedSupplyIndex_Collateral
			);

			await validateMarket(
				alkemiEarnVerifiedHarness,
				borrowed._address,
				"handles max for an unsupported market: borrowed",
				{
					blockNumber: liquidateResult.blockNumber,
					totalSupply: liquidationSetup.initialTokenBalanceOtherSupplier,
					supplyRateMantissa: simpleSupplyRateMantissa,
					supplyIndex: 1.96 * 10 ** 18, // initial 10e18, multiplied by (1 + 4 * 0.1) at borrow and then (1 + 4 * 0.1) at liquidate
					totalBorrows: expectedBorrowBalanceAfter_TargetUserBorrowed,
					borrowRateMantissa: simpleBorrowRateMantissa,
					borrowIndex: expectedBorrowIndexBorrowedAsset,
				}
			);

			await validateMarket(
				alkemiEarnVerifiedHarness,
				collateral._address,
				"handles max for an unsupported market: collateral",
				{
					blockNumber: liquidateResult.blockNumber,
					totalSupply: expectedAccumulatedSupplyBalance_TargetUserCollateral, // though now it is split across target user and liquidator
					supplyRateMantissa: simpleSupplyRateMantissa,
					supplyIndex: expectedSupplyIndex_Collateral,
					totalBorrows: 0,
					borrowRateMantissa: simpleBorrowRateMantissa,
					borrowIndex: 3.5 * 10 ** 18, // initial 10e18 when supplied, multiplied by (1 + 5*0.5) at liquidate
				}
			);
		});

		it("allows max for liquidation of 0", async () => {
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
				supplyCollateralBlock,
				borrowBlock,
			} = await setupValidLiquidation();

			// Make borrower's collateral more valuable so the borrow is not eligible for liquidation.
			// Set price of collateral to 4:1
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPrice(collateral._address, 4, 1)
				.send({ from: root });

			/////////// Call function. liquidate max by specifying -1
			const liquidateResult = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, -1)
				.send({ from: liquidator });

			/////////// Validate
			// First let's make sure the environment is setup as we expected; otherwise we might get a successful test for the wrong reason.
			// We expect 4 blocks of supply interest at 10% per block, so make sure 4 blocks have passed since the supply of collateral was received.
			// 4 blocks comes from 2 blocks in setupValidLiquidation() and then 2 blocks here to do the price change and liquidation.
			assert.equal(supplyCollateralBlock + 4, liquidateResult.blockNumber);

			// We expect 3 blocks of borrow interest at 50% per block so make sure 3 blocks have passed since the borrow was created.
			// 3 blocks comes from 1 block in setupValidLiquidation() and then 2 blocks here to do the price change and liquidation.
			assert.equal(borrowBlock + 3, liquidateResult.blockNumber);

			const expectedAccumulatedBorrowBalance_TargetUserBorrowed = 25; // 10 + ( 3 blocks * 50%/block * 10) = 10 + 15 = 25;
			const expectedAmountRepaid = 0; // Collateral price is very high so there is no shortfall.
			const expectedBorrowBalanceAfter_TargetUserBorrowed =
				expectedAccumulatedBorrowBalance_TargetUserBorrowed -
				expectedAmountRepaid;

			const expectedAccumulatedSupplyBalance_TargetUserCollateral = 14; // 10 + (4 blocks * 10%/block * 10 = 10 + 4 = 14;
			const expectedSupplyIndex_Collateral = 1.4 * 10 ** 18; // ((4 blocks * 10%) + 1) * 10**18 (initial interest index)
			const expectedAmountSeized = 0; // Collateral price is very high so there is no shortfall.
			const expectedSupplyBalanceAfter_TargetUserCollateral =
				expectedAccumulatedSupplyBalance_TargetUserCollateral -
				expectedAmountSeized; // See comment re expectedAmountRepaid

			assert.hasLog(liquidateResult, "BorrowLiquidated", {
				targetAccount: checksum(borrower),
				assetBorrow: borrowed._address,
				borrowBalanceBefore: liquidationSetup.initialBorrowAmount.toString(),
				borrowBalanceAccumulated:
					expectedAccumulatedBorrowBalance_TargetUserBorrowed.toString(),
				amountRepaid: expectedAmountRepaid.toString(),
				borrowBalanceAfter:
					expectedBorrowBalanceAfter_TargetUserBorrowed.toString(),
				liquidator: checksum(liquidator),
				assetCollateral: collateral._address,
				collateralBalanceBefore:
					liquidationSetup.initialCollateralAmount.toString(),
				collateralBalanceAccumulated:
					expectedAccumulatedSupplyBalance_TargetUserCollateral.toString(),
				amountSeized: expectedAmountSeized.toString(),
				collateralBalanceAfter:
					expectedSupplyBalanceAfter_TargetUserCollateral.toString(),
			});

			// Liquidator's off-protocol token balance should have declined by the amount used to reduce the target user's borrow
			const liquidatorTokenBalance = await borrowed.methods
				.balanceOf(liquidator)
				.call();
			assert.equal(
				liquidatorTokenBalance,
				liquidationSetup.initialTokenBalanceLiquidator - expectedAmountRepaid
			);

			// Seized collateral goes to the liquidator's protocol account
			const liquidatorCollateralBalance =
				await alkemiEarnVerifiedHarness.methods
					.supplyBalances(liquidator, collateral._address)
					.call();
			assert.equal(liquidatorCollateralBalance.principal, expectedAmountSeized);
			assert.equal(
				liquidatorCollateralBalance.interestIndex,
				expectedSupplyIndex_Collateral
			); // ((4 blocks * 10%) + 1) * 10**18 (initial interest index)

			const borrowerBorrowBalance = await alkemiEarnVerifiedHarness.methods
				.borrowBalances(borrower, borrowed._address)
				.call();
			const expectedBorrowIndexBorrowedAsset = 7.5 * 10 ** 18; // ((3 blocks * 50%) + 1) * (3 * 10**18) (previous interest index)
			assert.equal(
				borrowerBorrowBalance.principal,
				expectedBorrowBalanceAfter_TargetUserBorrowed
			);
			assert.equal(
				borrowerBorrowBalance.interestIndex,
				expectedBorrowIndexBorrowedAsset
			);

			const borrowerCollateralBalance = await alkemiEarnVerifiedHarness.methods
				.supplyBalances(borrower, collateral._address)
				.call();
			assert.equal(
				borrowerCollateralBalance.principal,
				expectedSupplyBalanceAfter_TargetUserCollateral
			);
			assert.equal(
				borrowerCollateralBalance.interestIndex,
				expectedSupplyIndex_Collateral
			);

			await validateMarket(
				alkemiEarnVerifiedHarness,
				borrowed._address,
				"allows max for liquidation of 0: borrowed",
				{
					blockNumber: liquidateResult.blockNumber,
					totalSupply: liquidationSetup.initialTokenBalanceOtherSupplier,
					supplyRateMantissa: simpleSupplyRateMantissa,
					supplyIndex: 1.82 * 10 ** 18, //initial 10**18 * (1 + 4*0.1) * (1 + 3*0.1)
					totalBorrows: expectedBorrowBalanceAfter_TargetUserBorrowed,
					borrowRateMantissa: simpleBorrowRateMantissa,
					borrowIndex: expectedBorrowIndexBorrowedAsset,
				}
			);

			await validateMarket(
				alkemiEarnVerifiedHarness,
				collateral._address,
				"allows max for liquidation of 0: collateral",
				{
					blockNumber: liquidateResult.blockNumber,
					totalSupply: expectedAccumulatedSupplyBalance_TargetUserCollateral, // though now it is split across target user and liquidator
					supplyRateMantissa: simpleSupplyRateMantissa,
					supplyIndex: expectedSupplyIndex_Collateral,
					totalBorrows: 0,
					borrowRateMantissa: simpleBorrowRateMantissa,
					borrowIndex: 3 * 10 ** 18, // initial 10e18 when supplied, multiplied by (1 + 4*0.5) at liquidate
				}
			);
		});

		it("handles unset price oracle", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// SETUP DESIRED FAILURE:
			// Set current borrow interest index to maxUint so when we multiply by it we get an overflow
			await alkemiEarnVerifiedHarness.methods
				.harnessSetOracle("0x0000000000000000000000000000000000000000")
				.send({ from: root });
			await alkemiEarnVerifiedHarness.methods
				.harnessSetUseOracle(true)
				.send({ from: root });

			/////////// Call function
			const liquidateResult = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				liquidateResult,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.ZERO_ORACLE_ADDRESS,
				FailureInfoEnum.LIQUIDATE_FETCH_ASSET_PRICE_FAILED
			);
		});

		it("fails with zero oracle price (borrowed)", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// Set oracle price to zero for borrowed
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPriceMantissa(borrowed._address, 0)
				.send({ from: root });

			/////////// Call function
			const liquidateResult = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				liquidateResult,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.DIVISION_BY_ZERO,
				FailureInfoEnum.LIQUIDATE_BORROW_DENOMINATED_COLLATERAL_CALCULATION_FAILED
			);
		});

		it("fails with zero oracle price (collateral)", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// Set oracle price to zero for borrowed
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPriceMantissa(collateral._address, 0)
				.send({ from: root });

			/////////// Call function
			const liquidateResult = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				liquidateResult,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.MISSING_ASSET_PRICE,
				FailureInfoEnum.LIQUIDATE_DISCOUNTED_REPAY_TO_EVEN_AMOUNT_CALCULATION_FAILED
			);
		});

		it("handles failure to calculate new borrow index for borrowed asset", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
				supplyCollateralBlock,
				borrowBlock,
			} = await setupValidLiquidation();

			// SETUP DESIRED FAILURE:
			// Set current borrow interest index to maxUint so when we multiply by it we get an overflow
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(
					borrowed._address,
					0,
					0,
					1,
					10,
					0,
					bigNums.maxUint.toString(10)
				)
				.send({ from: root });

			/////////// Call function
			const liquidateResult = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				liquidateResult,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.INTEGER_OVERFLOW,
				FailureInfoEnum.LIQUIDATE_NEW_BORROW_INDEX_CALCULATION_FAILED_BORROWED_ASSET
			);
		});

		it("handles failure to calculate new borrow balance for borrowed asset", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// SETUP DESIRED FAILURE:
			// Set zero as the previous borrow index for the customer's borrow. This should cause div by zero error in balance calc.
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountBorrowBalance(borrower, borrowed._address, 10, 0)
				.send({ from: root });

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				result,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.DIVISION_BY_ZERO,
				FailureInfoEnum.LIQUIDATE_ACCUMULATED_BORROW_BALANCE_CALCULATION_FAILED
			);
		});

		it("handles failure to calculate new supply index for collateral asset", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// SETUP DESIRED FAILURE:
			// Set current borrow interest index to maxUint so when we multiply by it we get an overflow
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(
					collateral._address,
					100,
					0,
					bigNums.maxUint.toString(10),
					0,
					0,
					1
				)
				.send({ from: root });

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				result,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.INTEGER_OVERFLOW,
				FailureInfoEnum.LIQUIDATE_NEW_SUPPLY_INDEX_CALCULATION_FAILED_COLLATERAL_ASSET
			);
		});

		it("handles failure to calculate new supply index for borrower collateral asset", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// SETUP DESIRED FAILURE:
			// Set zero as the previous supply index for the borrower's collateral. This should cause div by zero error in balance calc.
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountSupplyBalance(borrower, collateral._address, 10, 0)
				.send({ from: root });

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				result,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.DIVISION_BY_ZERO,
				FailureInfoEnum.LIQUIDATE_ACCUMULATED_SUPPLY_BALANCE_CALCULATION_FAILED_BORROWER_COLLATERAL_ASSET
			);
		});

		it("handles failure to calculate new supply index for liquidator collateral asset", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// SETUP DESIRED FAILURE:
			// Set zero as the previous supply index for the liquidator's collateral. This should cause div by zero error in balance calc.
			// NOTE: We also have to give the liquidator a previous balance of collateral to avoid short circuit.
			// This means we can't use the standard failed liquidation validator below.
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountSupplyBalance(liquidator, collateral._address, 1, 0)
				.send({ from: root });

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			assert.hasFailure(
				result,
				ErrorEnum.DIVISION_BY_ZERO,
				FailureInfoEnum.LIQUIDATE_ACCUMULATED_SUPPLY_BALANCE_CALCULATION_FAILED_LIQUIDATOR_COLLATERAL_ASSET
			);

			// Started with 100, should still have 100
			const liquidatorTokenBalance = await borrowed.methods
				.balanceOf(liquidator)
				.call();
			assert.equal(100, liquidatorTokenBalance);

			// No collateral was seized, but we had to give liquidator an existing balance of 1 in order to hit the error
			const liquidatorCollateralBalance =
				await alkemiEarnVerifiedHarness.methods
					.supplyBalances(liquidator, collateral._address)
					.call();
			assert.equal(1, liquidatorCollateralBalance.principal);

			// should be unchanged from original 10
			const borrowerBorrowBalance = await alkemiEarnVerifiedHarness.methods
				.borrowBalances(borrower, borrowed._address)
				.call();
			assert.equal(10, borrowerBorrowBalance.principal);

			// should be unchanged from original 10
			const borrowerCollateralBalance = await alkemiEarnVerifiedHarness.methods
				.supplyBalances(borrower, collateral._address)
				.call();
			assert.equal(10, borrowerCollateralBalance.principal);
		});

		it("handles failure to calculate new total supply balance from borrower collateral asset", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// SETUP DESIRED FAILURE:
			// Give the protocol a token balance of maxUint so when we calculate adding the borrower's accumulated supply to it, it will overflow.
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(
					collateral._address,
					bigNums.maxUint.toString(10),
					0,
					(10 ** 18).toString(10),
					0,
					0,
					(10 ** 18).toString(10)
				)
				.send({ from: root });

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				result,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.INTEGER_OVERFLOW,
				FailureInfoEnum.LIQUIDATE_NEW_TOTAL_SUPPLY_BALANCE_CALCULATION_FAILED_BORROWER_COLLATERAL_ASSET
			);
		});

		it("handles failure to calculate new total supply balance from liquidator collateral asset", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// SETUP DESIRED FAILURE:
			// Give the liquidator a supply balance of maxUint so when we add it to the total supply as of the borrower's accumulated collateral, it will overflow
			// This means we can't use the standard failed liquidation validator below.
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountSupplyBalance(
					liquidator,
					collateral._address,
					bigNums.maxUint.toString(10),
					1
				)
				.send({ from: root });
			// Give protocol 11 and interest rate zero so we don't overflow earlier in the process
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(collateral._address, 11, 0, 1, 0, 0, 1)
				.send({ from: root });

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			assert.hasFailure(
				result,
				ErrorEnum.INTEGER_OVERFLOW,
				FailureInfoEnum.LIQUIDATE_NEW_TOTAL_SUPPLY_BALANCE_CALCULATION_FAILED_LIQUIDATOR_COLLATERAL_ASSET
			);

			// Started with 100, should still have 100
			const liquidatorTokenBalance = await borrowed.methods
				.balanceOf(liquidator)
				.call();
			assert.equal(100, liquidatorTokenBalance);

			// No collateral was seized, but we had to give liquidator an existing balance of max uint in order to hit the error
			const liquidatorCollateralBalance =
				await alkemiEarnVerifiedHarness.methods
					.supplyBalances(liquidator, collateral._address)
					.call();
			assert.bigNumEquals(
				bigNums.maxUint,
				liquidatorCollateralBalance.principal
			);

			// should be unchanged from original 10
			const borrowerBorrowBalance = await alkemiEarnVerifiedHarness.methods
				.borrowBalances(borrower, borrowed._address)
				.call();
			assert.equal(10, borrowerBorrowBalance.principal);

			// should be unchanged from original 10
			const borrowerCollateralBalance = await alkemiEarnVerifiedHarness.methods
				.supplyBalances(borrower, collateral._address)
				.call();
			assert.equal(10, borrowerCollateralBalance.principal);
		});

		it("handles failure to calculate borrower liquidity", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// SETUP DESIRED FAILURE:
			// Use harness to ensure desired failure
			await alkemiEarnVerifiedHarness.methods
				.harnessSetFailLiquidityCheck(borrower, true)
				.send({ from: root });

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				result,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.INTEGER_OVERFLOW,
				FailureInfoEnum.LIQUIDATE_DISCOUNTED_REPAY_TO_EVEN_AMOUNT_CALCULATION_FAILED
			);
		});

		it("handles failure to calculate discounted borrow-denominated shortfall", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// SETUP DESIRED FAILURE:
			// Trigger a division by zero in `calculateDiscountedRepayToEvenAmount`:
			// Set price of borrowed to min exp and set a large liquidation discount.
			// Thus, the discounted price is zero and when we divide the shortfall by it, we get the error.
			// Note: We also have to set the collateral price low or we won't have anything eligible for liquidation.
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPrice(borrowed._address, 1, (10 ** 18).toString(10))
				.send({ from: root });
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPrice(collateral._address, 1, (10 ** 18).toString(10))
				.send({ from: root });
			await alkemiEarnVerifiedHarness.methods
				.harnessSetLiquidationDiscount("999000000000000000")
				.send({ from: root }); // .999

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				result,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.DIVISION_BY_ZERO,
				FailureInfoEnum.LIQUIDATE_DISCOUNTED_REPAY_TO_EVEN_AMOUNT_CALCULATION_FAILED
			);
		});

		it("handles failure to calculate discounted borrow-denominated collateral", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// SETUP DESIRED FAILURE:
			// use harness method to flag method for failure
			await alkemiEarnVerifiedHarness.methods
				.harnessSetFailBorrowDenominatedCollateralCalculation(true)
				.send({ from: root });

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				result,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.INTEGER_OVERFLOW,
				FailureInfoEnum.LIQUIDATE_BORROW_DENOMINATED_COLLATERAL_CALCULATION_FAILED
			);
		});

		it("handles case of liquidator requesting to close too much of borrow", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			/////////// Call function with a requested amount that is too high
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 30)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				result,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.INVALID_CLOSE_AMOUNT_REQUESTED,
				FailureInfoEnum.LIQUIDATE_CLOSE_AMOUNT_TOO_HIGH
			);
		});

		it("handles failure to calculate amount of borrow to seize", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// SETUP DESIRED FAILURE:
			// use harness method to flag method for failure
			await alkemiEarnVerifiedHarness.methods
				.harnessSetFailCalculateAmountSeize(true)
				.send({ from: root });

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				result,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.INTEGER_OVERFLOW,
				FailureInfoEnum.LIQUIDATE_AMOUNT_SEIZE_CALCULATION_FAILED
			);
		});

		it("handles failure to calculate new supply index for the collateral asset", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// SETUP DESIRED FAILURE:
			// Store a block number that should be HIGHER than the current block number so we'll get an underflow
			// when calculating block delta.
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketBlockNumber(collateral._address, -1)
				.send({ from: root });

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				result,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.INTEGER_UNDERFLOW,
				FailureInfoEnum.LIQUIDATE_NEW_SUPPLY_INDEX_CALCULATION_FAILED_COLLATERAL_ASSET
			);
		});

		it("handles failure to calculate new borrow index for the collateral asset", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupLiquidationWithHarnessForFailureTest();

			// SETUP DESIRED FAILURE:
			// Set current borrow interest index to maxUint so when we multiply by it we get an overflow
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(
					collateral._address,
					0,
					0,
					1,
					10,
					0,
					bigNums.maxUint.toString(10)
				)
				.send({ from: root });

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				result,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.INTEGER_OVERFLOW,
				FailureInfoEnum.LIQUIDATE_NEW_BORROW_INDEX_CALCULATION_FAILED_COLLATERAL_ASSET
			);
		});

		it("handles failure to calculate new supply rate for the borrowed asset", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// SETUP DESIRED FAILURE:
			// Set up FailingInterestModel for borrowed market
			const FailableInterestRateModel = getContract(
				"./test/InterestRateModel/FailableInterestRateModel.sol"
			);
			const failableInterestRateModel = await FailableInterestRateModel.new(
				true,
				false
			).send({ from: root });
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketInterestRateModel(
					borrowed._address,
					failableInterestRateModel._address
				)
				.send({ from: root });

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				result,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.OPAQUE_ERROR,
				FailureInfoEnum.LIQUIDATE_NEW_SUPPLY_RATE_CALCULATION_FAILED_BORROWED_ASSET
			);
		});

		it("handles failure to calculate new borrow rate for the borrowed asset", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// SETUP DESIRED FAILURE:
			// Set up FailingInterestModel for borrowed market
			const FailableInterestRateModel = getContract(
				"./test/InterestRateModel/FailableInterestRateModel.sol"
			);
			const failableInterestRateModel = await FailableInterestRateModel.new(
				false,
				true
			).send({ from: root });
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketInterestRateModel(
					borrowed._address,
					failableInterestRateModel._address
				)
				.send({ from: root });

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				result,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.OPAQUE_ERROR,
				FailureInfoEnum.LIQUIDATE_NEW_BORROW_RATE_CALCULATION_FAILED_BORROWED_ASSET
			);
		});

		it("handles failure to calculate new supply index for the borrowed asset", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupLiquidationWithHarnessForFailureTest();

			// SETUP DESIRED FAILURE:
			// Set current borrow interest index to maxUint so when we multiply by it we get an overflow
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(
					borrowed._address,
					0,
					0,
					bigNums.maxUint.toString(10),
					1000,
					0,
					2
				)
				.send({ from: root });

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				result,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.INTEGER_OVERFLOW,
				FailureInfoEnum.LIQUIDATE_NEW_SUPPLY_INDEX_CALCULATION_FAILED_BORROWED_ASSET
			);
		});

		it("handles failure to calculate new total borrow for the borrowed asset", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupLiquidationWithHarnessForFailureTest();

			// SETUP DESIRED FAILURE:
			// Give the protocol a token balance of 0 so when we subtract the new borrow from it, it will underflow.
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(borrowed._address, 0, 0, 1, 0, 0, 1)
				.send({ from: root });

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				result,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.INTEGER_UNDERFLOW,
				FailureInfoEnum.LIQUIDATE_NEW_TOTAL_BORROW_CALCULATION_FAILED_BORROWED_ASSET
			);
		});

		it("handles failure to calculate new total cash for the borrowed asset", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// SETUP DESIRED FAILURE:
			// We are going to repay 1, so fake out protocol current cash as maxUint so when we add the new cash it will overflow.
			await alkemiEarnVerifiedHarness.methods
				.harnessSetCash(borrowed._address, bigNums.maxUint.toString(10))
				.send({ from: root });

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				result,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.INTEGER_OVERFLOW,
				FailureInfoEnum.LIQUIDATE_NEW_TOTAL_CASH_CALCULATION_FAILED_BORROWED_ASSET
			);
		});

		it("handles failed transfer in of borrowed asset from liquidator", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// SETUP DESIRED FAILURE:
			// set up the token harness to fail transfer in from the liquidator
			await borrowed.methods
				.harnessSetFailTransferFromAddress(liquidator, true)
				.send({ from: root });

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				result,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.TOKEN_TRANSFER_FAILED,
				FailureInfoEnum.LIQUIDATE_TRANSFER_IN_FAILED
			);
		});

		it("raises when failed transfer in of borrowed non-standard asset from liquidator", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation(true);

			// SETUP DESIRED FAILURE:
			// set up the token harness to fail transfer in from the liquidator
			await borrowed.methods
				.harnessSetFailTransferFromAddress(liquidator, true)
				.send({ from: root });

			/////////// Call function
			await assert.revert(
				alkemiEarnVerifiedHarness.methods
					.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
					.send({ from: liquidator })
			);
		});

		it("handles liquidator failure to approve borrowed asset for transfer in to protocol", async () => {
			// We start with a valid setup then tweak as necessary to hit the desired error condition.
			const {
				alkemiEarnVerifiedHarness,
				borrower,
				liquidator,
				borrowed,
				collateral,
			} = await setupValidLiquidation();

			// SETUP DESIRED FAILURE:
			// remove liquidator's approval for borrowed asset
			await borrowed.methods
				.approve(alkemiEarnVerifiedHarness._address, 0)
				.send({ from: liquidator });

			/////////// Call function
			const result = await alkemiEarnVerifiedHarness.methods
				.liquidateBorrow(borrower, borrowed._address, collateral._address, 1)
				.send({ from: liquidator });

			await validateFailedLiquidation(
				result,
				alkemiEarnVerifiedHarness,
				borrower,
				borrowed,
				collateral,
				liquidator,
				ErrorEnum.TOKEN_INSUFFICIENT_ALLOWANCE,
				FailureInfoEnum.LIQUIDATE_TRANSFER_IN_NOT_POSSIBLE
			);
		});
	});
});
