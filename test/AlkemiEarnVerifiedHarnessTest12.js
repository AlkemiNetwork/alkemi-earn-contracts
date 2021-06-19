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

	describe("harnessCalculateAccountLiquidity", async () => {
		// For simplicity, we'll use the same basis points and interest indexes for all
		// assets under test.
		let account;
		let collateralRatio;
		let supplyInterestIndex;
		let borrowInterestIndex;
		let supplyRateBasisPoints;
		let borrowRateBasisPoints;

		before(async () => {
			account = accounts[0];
			collateralRatio = 2;
			supplyInterestIndex = 1;
			borrowInterestIndex = 1;
			supplyRateBasisPoints = 2;
			borrowRateBasisPoints = 5;
		});

		// List of scenarios we will run for various token balances
		// and expected errors, liquidity &shortfalls.
		[
			{
				name: "Nothing supplied or borrowed",
				tokens: {},
				balances: {},
				expected: { liquidity: 0.0, shortfall: 0.0 },
			},
			{
				name: "Single supply",
				tokens: { ETH: 1.0 },
				balances: { supply: { ETH: 1 } },
				expected: { liquidity: 1.0, shortfall: 0 },
			},
			{
				name: "Single borrow", // should not be possible but still
				tokens: { OMG: 0.5 },
				balances: { borrow: { OMG: 1 } },
				expected: { liquidity: 0.0, shortfall: 1.0 },
			},
			{
				name: "Supply of 2 assets",
				tokens: { ETH: 1.0, OMG: 0.5 },
				balances: { supply: { ETH: 1, OMG: 5 } },
				expected: { liquidity: 3.5, shortfall: 0.0 },
			},
			{
				name: "Borrow of 2 assets", // again should not be possible
				tokens: { ETH: 1.0, OMG: 0.5 },
				balances: { borrow: { ETH: 1, OMG: 5 } },
				expected: { liquidity: 0.0, shortfall: 7.0 },
			},
			{
				name: "Single supply, single borrow cancel out (collatRatio = 2)",
				tokens: { ETH: 1.0, OMG: 1.0 },
				balances: { supply: { ETH: 2 }, borrow: { OMG: 1 } },
				expected: { liquidity: 0.0, shortfall: 0.0 },
			},
			{
				name: "Supply 1 OMG Wei, Borrow 1 ETH Wei. Prices (ETH: 1.0, OMG: 0.5)",
				tokens: { ETH: 1.0, OMG: 0.5 },
				balances: { supply: { OMG: 1 }, borrow: { ETH: 1 } },
				expected: { liquidity: 0.0, shortfall: 1.5 },
			},
			{
				// 500 OMG @ 0.018206 = 9.103 ETH Supplies (actual Eth, not Eth Wei)
				// 9.103 - 2(1 ETH) = 7.13 ETH liquidity
				name: "Supply 500 OMG, Borrow 1 ETH. Prices (ETH: 1.0, OMG: 0.018206)",
				tokens: { ETH: 1.0, OMG: 0.018206 },
				balances: { supply: { OMG: 500e18 }, borrow: { ETH: 1e18 } },
				expected: { liquidity: 7.103e18, shortfall: 0.0 },
			},
			{
				// 500 OMG @ 0.018206 = 9.103 ETH Supplies (actual Eth, not Eth Wei)
				// 9.103 - 2(5 ETH) = 7.13 ETH shortfall
				name: "Supply 500 OMG, Borrow 5 ETH. Prices (ETH: 1.0, OMG: 0.018206)",
				tokens: { ETH: 1.0, OMG: 0.018206 },
				balances: { supply: { OMG: 500e18 }, borrow: { ETH: 5e18 } },
				expected: { liquidity: 0.0, shortfall: 0.897e18 },
			},
			{
				name: "Supply 1 OMG Wei, Borrow 1 ETH Wei. Prices (ETH: 1.0, OMG: 0.5) & collatRatio = 1",
				tokens: { ETH: 1.0, OMG: 0.5 },
				balances: { supply: { OMG: 1 }, borrow: { ETH: 1 } },
				collateralRatio: 1.0,
				expected: { liquidity: 0.0, shortfall: 0.5 },
			},
			{
				// 75 OMG @ 0.018206 = 1.36545 ETH Supplies (actual Eth, not Eth Wei)
				// 1.36545 - 1.5(1.5) ETH) = 0.88455 ETH shortfall
				name: "Supply 75 OMG, Borrow 1.5 ETH. Prices (ETH: 1.0, OMG: 0.018206) & collatRatio = 1.5",
				tokens: { ETH: 1.0, OMG: 0.018206 },
				balances: { supply: { OMG: 75e18 }, borrow: { ETH: 1.5e18 } },
				collateralRatio: 1.5,
				expected: { liquidity: 0.0, shortfall: 0.88455e18 },
			},
			{
				// 8 ETH @ 1 = 8 ETH Supplies (actual Eth, not Eth Wei)
				// 100 OMG @ 0.018206 = 1.8206 ETH Borrows
				// 8 - 3(1.8206) ETH) = 2.5382 ETH liquidity
				name: "Supply 8 ETH, Borrow 100 OMG. Prices (ETH: 1.0, OMG: 0.018206) & collatRatio = 3",
				tokens: { ETH: 1.0, OMG: 0.018206 },
				balances: { supply: { ETH: 8e18 }, borrow: { OMG: 100e18 } },
				collateralRatio: 3.0,
				expected: { liquidity: 2.5382e18, shortfall: 0.0 },
			},
		].forEach((args) => {
			it(args["name"], async () => {
				const alkemiEarnVerifiedHarness =
					await AlkemiEarnVerifiedHarness.new().send({
						from: root,
					});
				await readAndExecContract(
					alkemiEarnVerifiedHarness,
					"initializer",
					[],
					{
						from: root,
					}
				);
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
					[root, true],
					{
						from: root,
					}
				);
				const simpleInterestRateModel =
					await SimpleInterestRateModel.new().send({ from: root });

				// Default collateral ratio = 2, unless scenario specifies.
				if (args.hasOwnProperty("collateralRatio")) {
					await alkemiEarnVerifiedHarness.methods
						.harnessSetCollateralRatio(
							getExpMantissa(args["collateralRatio"]).toString(10),
							getExpMantissa(1).toString(10)
						)
						.send({ from: root });
				} else {
					await alkemiEarnVerifiedHarness.methods
						.harnessSetCollateralRatio(2, 1)
						.send({ from: root });
				}

				// Add collateral assets and then set the asset prices
				Object.entries(args["tokens"]).forEach(([key, value]) => {
					assert.isTrue(
						assets.hasOwnProperty(key),
						"Token key must exist in assets: " + JSON.stringify(args)
					);

					// Set the interest model
					alkemiEarnVerifiedHarness.methods
						.harnessSetMarketInterestRateModel(
							assets[key],
							simpleInterestRateModel._address
						)
						.send({ from: root });

					// Add the collateral market
					alkemiEarnVerifiedHarness.methods
						.harnessAddCollateralMarket(assets[key])
						.send({ from: root });

					// Set the prices
					alkemiEarnVerifiedHarness.methods
						.harnessSetAssetPrice(
							assets[key],
							getExpMantissa(value).toString(10),
							getExpMantissa(1).toString(10)
						)
						.send({ from: root });
				});

				// Set the balances and add up supply/balance totals for each market so we can set them also
				let marketSupplyTotals = {};
				let marketBorrowTotals = {};
				await Promise.all(
					Object.entries(args["balances"]).map(([balanceKey, balanceValue]) => {
						if (balanceKey === "supply" || balanceKey === "borrow") {
							return Promise.all(
								Object.entries(balanceValue).map(([assetKey, assetAmount]) => {
									assert.isTrue(
										assets.hasOwnProperty(assetKey),
										"Balance key must exist in assets: " + JSON.stringify(args)
									);

									// Add an entry for both running sums if we haven't already
									if (!marketSupplyTotals.hasOwnProperty(assetKey)) {
										marketSupplyTotals[assetKey] = 0;
									}
									if (!marketBorrowTotals.hasOwnProperty(assetKey)) {
										marketBorrowTotals[assetKey] = 0;
									}

									if (balanceKey === "supply") {
										marketSupplyTotals[assetKey] += assetAmount;

										return alkemiEarnVerifiedHarness.methods
											.harnessSetAccountSupplyBalance(
												account,
												assets[assetKey],
												assetAmount.toString(10),
												supplyInterestIndex.toString(10)
											)
											.send({ from: root });
									} else {
										marketBorrowTotals[assetKey] += assetAmount;

										return alkemiEarnVerifiedHarness.methods
											.harnessSetAccountBorrowBalance(
												account,
												assets[assetKey],
												assetAmount.toString(10),
												borrowInterestIndex.toString(10)
											)
											.send({ from: root });
									}
								})
							);
						}
					})
				);

				// Lastly, set the market details with our supply/borrow totals
				// Using a for of here to allow us to await setting the Alkemi Earn Verified details.
				for (let assetKey of Object.keys(marketSupplyTotals)) {
					await alkemiEarnVerifiedHarness.methods
						.harnessSetMarketDetails(
							assets[assetKey],
							marketSupplyTotals[assetKey].toString(),
							supplyRateBasisPoints.toString(),
							supplyInterestIndex.toString(),
							marketBorrowTotals[assetKey].toString(),
							borrowRateBasisPoints.toString(),
							borrowInterestIndex.toString()
						)
						.send({ from: root });
				}

				const result = await alkemiEarnVerifiedHarness.methods
					.harnessCalculateAccountLiquidity(account)
					.call();

				assert.noError(result[0]);
				assert.withinPercentage(
					getExpMantissa(args["expected"]["liquidity"]),
					result[1],
					10e-10,
					"Expected liquidity not within percentage for scenario: " +
						JSON.stringify(args)
				);
				assert.withinPercentage(
					getExpMantissa(args["expected"]["shortfall"]),
					result[2],
					10e-10,
					"Expected shortfall not within percentage  for scenario: " +
						JSON.stringify(args)
				);

				const liquidity = Number(
					await alkemiEarnVerifiedHarness.methods
						.getAccountLiquidity(account)
						.call()
				);
				const expLiq =
					args["expected"]["liquidity"] - args["expected"]["shortfall"];

				assert.withinPercentage(
					Math.trunc(expLiq),
					liquidity,
					10e-10,
					"Expected total account liquidity not within percentage for scenario: " +
						JSON.stringify(args)
				);
			});
		});

		it("returns account liquidity when there IS Supply interest to accumulate", async () => {
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
				[root, true],
				{
					from: root,
				}
			);
			await alkemiEarnVerifiedHarness.methods
				.harnessSetCollateralRatio(2, 1)
				.send({ from: root });

			const customer = accounts[1];
			const OMG = await EIP20.new(100, "test omg", 18, "omg").send({
				from: root,
			});
			const ETH = await EIP20.new(100, "eth", 18, "eth").send({ from: root });

			// Set up SimpleInterestRateModel for OMG & ETH markets
			const simpleInterestRateModel = await SimpleInterestRateModel.new().send({
				from: root,
			});

			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketInterestRateModel(
					OMG._address,
					simpleInterestRateModel._address
				)
				.send({ from: root });
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketInterestRateModel(
					ETH._address,
					simpleInterestRateModel._address
				)
				.send({ from: root });

			// Add the collateral market
			await alkemiEarnVerifiedHarness.methods
				.harnessAddCollateralMarket(OMG._address)
				.send({ from: root });
			await alkemiEarnVerifiedHarness.methods
				.harnessAddCollateralMarket(ETH._address)
				.send({ from: root });

			// Set the prices (ETH = 1.0, OMG = 0.01908530)
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPrice(
					OMG._address,
					getExpMantissa(0.0190853).toString(10),
					getExpMantissa(1).toString(10)
				)
				.send({ from: root });
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPrice(ETH._address, 1, 1)
				.send({ from: root });

			// First test is to have supplied 75 OMG @ Supply Rate of 50% and Borrow 1 ETH @ Rate of 0%
			const omgSupplied = 75e18;
			const ethBorrowed = 1e18;
			const customerSupplyInterestIndex = 1;
			const supplyRateBasisPoints = 5000;
			const supplyIndex = 2;
			const customerBorrowInterestIndex = 1;
			const borrowRateBasisPoints = 0;
			const borrowIndex = 1;

			// Setup OMG balances (causes 2 blocks to be mined)
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountSupplyBalance(
					account,
					OMG._address,
					omgSupplied.toString(10),
					customerSupplyInterestIndex.toString(10)
				)
				.send({ from: root });
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountBorrowBalance(
					account,
					OMG._address,
					0,
					customerBorrowInterestIndex
				)
				.send({ from: root });

			// Setup ETH balances (causes 2 more blocks to be mined)
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountSupplyBalance(
					account,
					ETH._address,
					0,
					customerSupplyInterestIndex
				)
				.send({ from: root });
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountBorrowBalance(
					account,
					ETH._address,
					ethBorrowed.toString(10),
					customerBorrowInterestIndex.toString(10)
				)
				.send({ from: root });

			// Here is the tricky part. Interest is calculated by using the delta for the current
			// block and the block number stored in the market. So we need to make sure we know
			// how many blocks are mined from now until the calculateLiquidity call. (2 blocks)
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(
					OMG._address,
					omgSupplied.toString(10),
					supplyRateBasisPoints.toString(10),
					supplyIndex.toString(10),
					0,
					0,
					borrowIndex
				)
				.send({ from: root });

			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(
					ETH._address,
					0,
					0,
					supplyIndex.toString(),
					ethBorrowed.toString(),
					borrowRateBasisPoints.toString(),
					borrowIndex.toString()
				)
				.send({ from: root });

			/** We cause the OMG supply principal to be quadrupled by setting supplyIndex = 2 * customerInterestIndex, and supplyRateBasisPoints = 5000
			 * Two blocks of 50% interest causes supplyIndex of 2 to be doubled to 4.
			 * We calculate new OMG supply balance by multiplying principal by 4/1.  75e18*4 = 300e18.
			 *
			 * We keep the ETH borrow principal constant by setting supplyIndex = 1 = customerInterestInterestIndex, and borrowRateBasisPoints = 0
			 *
			 * Finally, with a collateral ratio of 2, we expect the following liquidity results:
			 * 300 OMG @ 0.01908530 = 5.72559 ETH Supplies (actual Eth, not Eth Wei)
			 * 5.72559 - 2(1) ETH) = 3.72559 ETH liquidity
			 */
			const result = await alkemiEarnVerifiedHarness.methods
				.harnessCalculateAccountLiquidity(account)
				.call();

			assert.noError(result[0]);
			// assert.withinPercentage(
			// 	getExpMantissa(3.72559e18),
			// 	result[1],
			// 	10e-10,
			// 	"Calculated liquidity was incorrect"
			// );
			// assert.withinPercentage(
			// 	0,
			// 	result[2],
			// 	10e-10,
			// 	"should not have any value for shortfall"
			// );
		});

		it("returns account shortfall when there IS Borrow interest to accumulate", async () => {
			const alkemiEarnVerifiedHarness =
				await AlkemiEarnVerifiedHarness.new().send({
					from: root,
				});
			await readAndExecContract(alkemiEarnVerifiedHarness, "initializer", [], {
				from: root,
			});
			await alkemiEarnVerifiedHarness.methods
				.harnessSetCollateralRatio(2, 1)
				.send({ from: root });

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
			const ETH = await EIP20.new(100, "eth", 18, "eth").send({ from: root });

			// Set up SimpleInterestRateModel for OMG & ETH markets
			const simpleInterestRateModel = await SimpleInterestRateModel.new().send({
				from: root,
			});

			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketInterestRateModel(
					OMG._address,
					simpleInterestRateModel._address
				)
				.send({ from: root });
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketInterestRateModel(
					ETH._address,
					simpleInterestRateModel._address
				)
				.send({ from: root });

			// Add the collateral market
			await alkemiEarnVerifiedHarness.methods
				.harnessAddCollateralMarket(OMG._address)
				.send({ from: root });
			await alkemiEarnVerifiedHarness.methods
				.harnessAddCollateralMarket(ETH._address)
				.send({ from: root });

			// Set the prices (ETH = 1.0, OMG = 0.01908530)
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPrice(
					OMG._address,
					getExpMantissa(0.0190853).toString(10),
					getExpMantissa(1).toString(10)
				)
				.send({ from: root });
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAssetPrice(ETH._address, 1, 1)
				.send({ from: root });

			// First test is to have supplied 125 OMG @ Supply Rate of 0% and Borrow 3 ETH @ Rate of 25%
			const omgSupplied = 125e18;
			const ethBorrowed = 3e18;
			const customerSupplyInterestIndex = 1;
			const supplyRateBasisPoints = 0;
			const supplyIndex = 1;
			const customerBorrowInterestIndex = 1;
			const borrowRateBasisPoints = 2500;
			const borrowIndex = 2;

			// Setup OMG balances (causes 2 blocks to be mined)
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountSupplyBalance(
					account,
					OMG._address,
					omgSupplied.toString(10),
					customerSupplyInterestIndex.toString(10)
				)
				.send({ from: root });
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountBorrowBalance(
					account,
					OMG._address,
					0,
					customerBorrowInterestIndex
				)
				.send({ from: root });

			// Setup ETH balances (causes 2 more blocks to be mined)
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountSupplyBalance(
					account,
					ETH._address,
					0,
					customerSupplyInterestIndex
				)
				.send({ from: root });
			await alkemiEarnVerifiedHarness.methods
				.harnessSetAccountBorrowBalance(
					account,
					ETH._address,
					ethBorrowed.toString(10),
					customerBorrowInterestIndex.toString(10)
				)
				.send({ from: root });

			// Here is the tricky part. Interest is calculated by using the delta for the current
			// block and the block number stored in the market. So we need to make sure we know
			// how many blocks are mined from now until the calculateLiquidity call. (2 blocks)
			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(
					ETH._address,
					0,
					0,
					supplyIndex.toString(),
					ethBorrowed.toString(),
					borrowRateBasisPoints.toString(),
					borrowIndex.toString()
				)
				.send({ from: root });

			await alkemiEarnVerifiedHarness.methods
				.harnessSetMarketDetails(
					OMG._address,
					omgSupplied.toString(),
					supplyRateBasisPoints.toString(),
					supplyIndex.toString(),
					0,
					0,
					borrowIndex.toString()
				)
				.send({ from: root });

			/** We cause the ETH borrow principal to be 1.5x by setting borrowIndex = 2 * customerInterestIndex, and borrowRateBasisPoints = 2500
			 * Two blocks of 25% interest causes borrowIndex of 2 to become 3, i.e. 2 * (1 + 0.5) = 2 * (1.5) = 3
			 * We calculate new ETH borrow balance by multiplying principal by 3/1.  3e18*3 = 9e18.
			 *
			 * We keep the OMG supply principal constant by setting supplyIndex = 1 = customerInterestInterestIndex, and supplyRateBasisPoints = 0
			 *
			 * Finally, with a collateral ratio of 2, we expect the following shortfall results:
			 * 125 OMG @ 0.01908530 = 2.3856625 ETH Supplies (actual Eth, not Eth Wei)
			 * 2.3856625 - 2(9) ETH) = 15.6143375 ETH shortfall
			 */
			const result = await alkemiEarnVerifiedHarness.methods
				.harnessCalculateAccountLiquidity(account)
				.call();

			assert.noError(result[0]);
			// assert.withinPercentage(
			// 	0,
			// 	result[1],
			// 	10e-10,
			// 	"should not have any value for liquidity"
			// );
			// assert.withinPercentage(
			// 	getExpMantissa(15.6143375e18),
			// 	result[2],
			// 	10e-10,
			// 	"Calculated shortfall was incorrect"
			// );
		});
	});
});
