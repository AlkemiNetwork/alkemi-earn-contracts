"use strict";

const { ErrorEnum } = require("./ErrorReporter");
const { fallback, getContract, readAndExecContract } = require("./Contract");
const { assets, checksum, getExpMantissa, range } = require("./Utils");
const AlkemiEarnVerified = getContract("./AlkemiEarnVerified.sol");
const EIP20 = getContract("./test/EIP20Harness.sol");
const PriceOracle = getContract("./test/PriceOracleHarness.sol");
const StandardInterestRateModel = getContract("./AlkemiRateModel.sol");
const Immutable = require("seamless-immutable");

const addressZero = "0x0000000000000000000000000000000000000000";

contract("AlkemiEarnVerified", function ([root, ...accounts]) {
	describe("admin / _setPendingAdmin", async () => {
		it("admin is initially set to root and pendingAdmin is 0", async () => {
			const alkemiEarnVerified = await AlkemiEarnVerified.new().send({
				from: root,
			});
			await readAndExecContract(alkemiEarnVerified, "initializer", [], {
				from: root,
			});
			assert.matchesAddress(
				root,
				await alkemiEarnVerified.methods.admin().call()
			);
			assert.equal(
				addressZero,
				await alkemiEarnVerified.methods.pendingAdmin().call(),
				"pendingAdmin should be zero for a new contract"
			);
		});

		it("can be used by admin", async () => {
			const alkemiEarnVerified = await AlkemiEarnVerified.new().send({
				from: root,
			});
			await readAndExecContract(alkemiEarnVerified, "initializer", [], {
				from: root,
			});
			const [errorCode0, _tx0, _error0] = await readAndExecContract(
				alkemiEarnVerified,
				"_adminFunctions",
				[accounts[1], accounts[0], false, 1000000000000000,0,accounts[0],accounts[0]],
				{ from: root }
			);
			assert.noError(errorCode0);
			assert.matchesAddress(
				accounts[1],
				await alkemiEarnVerified.methods.pendingAdmin().call()
			);
			assert.matchesAddress(
				root,
				await alkemiEarnVerified.methods.admin().call()
			);
		});
	});

	describe("oracle / _setOracle", async () => {
		it("is initially unset", async () => {
			const alkemiEarnVerified = await AlkemiEarnVerified.new().send({
				from: root,
			});
			await readAndExecContract(alkemiEarnVerified, "initializer", [], {
				from: root,
			});
			assert.matchesAddress(
				addressZero,
				await alkemiEarnVerified.methods.oracle().call()
			);
		});

		it("it can be changed by admin", async () => {
			const alkemiEarnVerified = await AlkemiEarnVerified.new().send({
				from: root,
			});
			await readAndExecContract(alkemiEarnVerified, "initializer", [], {
				from: root,
			});
			const priceOracle = await PriceOracle.new().send({ from: root });
			const [errorCode0, _tx0, _error0] = await readAndExecContract(
				alkemiEarnVerified,
				"_adminFunctions",
				[root, priceOracle._address, false, 1000000000000000,0,root,root],
				{ from: root }
			);
			assert.matchesAddress(
				priceOracle._address,
				await alkemiEarnVerified.methods.priceOracle().call()
			);
		});

		// it("reverts if new address is not really an oracle", async () => {
		// 	const alkemiEarnVerified = await AlkemiEarnVerified.new().send({ from: root });
		// 	await readAndExecContract(alkemiEarnVerified, "initializer", [], { from: root });

		// 	await assert.revert(
		// 		await alkemiEarnVerified.methods._setOracle(accounts[1]).send({ from: root })
		// 	);
		// });
	});

	// describe("gas tests", async () => {
	// 	let gasResults = Immutable({});

	// 	if (process.env.SHOW_GAS_COST) {
	// 		after(() => {
	// 			[false, true].forEach((hasAllAssets) => {
	// 				if (gasResults[hasAllAssets]) {
	// 					let strResult = "";
	// 					const results = gasResults[hasAllAssets];

	// 					Object.entries(results).forEach(([marketCount, methodResults]) => {
	// 						let methodResultsList = [];

	// 						["supply", "withdraw", "borrow", "repayBorrow"].forEach(
	// 							(method) => {
	// 								methodResultsList.push(methodResults[method]);
	// 							}
	// 						);

	// 						strResult += methodResultsList.join("\t") + "\n";
	// 					});

	// 					console.log(
	// 						hasAllAssets
	// 							? "When account has supply and borrow of each asset"
	// 							: "When account has supply and borrow of only one asset"
	// 					);
	// 					console.log(strResult);
	// 				}
	// 			});
	// 		});
	// 	}

	// 	[true, false].forEach((hasAllAssets) => {
	// 		[
	// 			["supply", 1, 117382, 117382],
	// 			["supply", 2, 117382, 117382],
	// 			["supply", 3, 117382, 117382],
	// 			["supply", 4, 117382, 117382],
	// 			["supply", 5, 117382, 117382],
	// 			["supply", 10, 117318, 117382],
	// 			["withdraw", 1, 119605 + 10907, 121703],
	// 			["withdraw", 2, 122352 + 10055, 134554 + 11626],
	// 			["withdraw", 3, 125099, 147347 + 15882],
	// 			["withdraw", 4, 127846, 160145 + 20140],
	// 			["withdraw", 5, 130593, 172950 + 24397],
	// 			["withdraw", 10, 144328, 237062 + 43647],
	// 			["borrow", 1, 121139 + 10364, 123298],
	// 			["borrow", 2, 123886, 136086 + 11243],
	// 			["borrow", 3, 126633, 148880 + 15500],
	// 			["borrow", 4, 129380, 161680 + 19693],
	// 			["borrow", 5, 132127, 174486 + 24014],
	// 			["borrow", 10, 145862, 238604 + 43019],
	// 			["repayBorrow", 1, 116679, 116679],
	// 			["repayBorrow", 2, 116679, 116679],
	// 			["repayBorrow", 3, 116679, 116615],
	// 			["repayBorrow", 4, 116679, 116679],
	// 			["repayBorrow", 5, 116615, 116679],
	// 			["repayBorrow", 10, 116679, 116679],
	// 		].forEach(([method, marketCount, expectedGasOne, expectedGasAll]) => {
	// 			it(`${method} with ${marketCount} market(s) ${
	// 				hasAllAssets ? "with all assets" : "with one asset"
	// 			} @gas`, async () => {
	// 				const log = {
	// 					supply: "SupplyReceived",
	// 					withdraw: "SupplyWithdrawn",
	// 					borrow: "BorrowTaken",
	// 					repayBorrow: "BorrowRepaid",
	// 				}[method];

	// 				const alkemiEarnVerified = await AlkemiEarnVerified.new().send({ from: root });
	// 				await readAndExecContract(alkemiEarnVerified, "initializer", [], {
	// 					from: root,
	// 				});
	// 				const priceOracle = await PriceOracle.new().send({ from: root });
	// 				await alkemiEarnVerified.methods
	// 					._setOracle(priceOracle._address)
	// 					.send({ from: root });

	// 				const customer = accounts[1];
	// 				const markets = await Promise.all(
	// 					range(marketCount).map((i) => {
	// 						return EIP20.new(
	// 							(10 ** 18).toString(),
	// 							`test market ${i}`,
	// 							18,
	// 							`mrkt${i}`
	// 						).send({ from: root });
	// 					})
	// 				);

	// 				// Interest model
	// 				const interestRateModel = await StandardInterestRateModel.new().send({
	// 					from: root,
	// 				});
	// 				// const interestRateModel = await SimpleInterestRateModel.new().send({from: root});
	// 				await alkemiEarnVerified.methods._changeKYCAdmin(root,true).send({ from: root });

	// 				await alkemiEarnVerified.methods
	// 					.addCustomerKYC(customer)
	// 					.send({ from: root });

	// 				// assets must have prices before they can be supported
	// 				await await Promise.all(
	// 					markets.map((market) => {
	// 						return Promise.all([
	// 							priceOracle.methods
	// 								.harnessSetAssetPrice(
	// 									market._address,
	// 									getExpMantissa(1.0).toString()
	// 								)
	// 								.send({ from: root }),
	// 						]);
	// 					})
	// 				);

	// 				await await Promise.all(
	// 					markets.map((market) => {
	// 						return Promise.all([
	// 							// Add support markets
	// 							alkemiEarnVerified.methods
	// 								._supportMarket(market._address, interestRateModel._address)
	// 								.send({ from: root }),

	// 							// Transfer tokens to customer
	// 							market.methods.transfer(customer, 100).send({ from: root }),

	// 							// Customer now approves our Alkemi Earn Verified to spend its value
	// 							market.methods
	// 								.approve(alkemiEarnVerified._address, 100)
	// 								.send({ from: customer }),
	// 						]);
	// 					})
	// 				);

	// 				if (hasAllAssets) {
	// 					await await Promise.all(
	// 						markets.map((market) => {
	// 							// Customer supplies to protocol
	// 							return alkemiEarnVerified.methods
	// 								.supply(market._address, 50)
	// 								.send({ from: customer, value: 0 })
	// 								.then(assert.success);
	// 						})
	// 					);

	// 					await await Promise.all(
	// 						markets.map((market) => {
	// 							// Customer borrows from protocol
	// 							return alkemiEarnVerified.methods
	// 								.borrow(market._address, 10)
	// 								.send({ from: customer })
	// 								.then(assert.success);
	// 						})
	// 					);
	// 				} else {
	// 					await alkemiEarnVerified.methods
	// 						.supply(markets[0]._address, 50)
	// 						.send({ from: customer, value: 0 })
	// 						.then(assert.success);
	// 					await alkemiEarnVerified.methods
	// 						.borrow(markets[0]._address, 10)
	// 						.send({ from: customer })
	// 						.then(assert.success);
	// 				}

	// 				// Set gas expectation
	// 				const expectedGas = hasAllAssets ? expectedGasAll : expectedGasOne;

	// 				// Customer now performs action

	// 				// Prime the pump
	// 				const result1 = await alkemiEarnVerified.methods[method](
	// 					markets[0]._address,
	// 					1
	// 				).send({ from: customer });

	// 				assert.hasLog(result1, log, { amount: "1" });

	// 				// And again
	// 				const result2 = await alkemiEarnVerified.methods[method](
	// 					markets[0]._address,
	// 					2
	// 				).send({ from: customer });

	// 				assert.hasLog(result2, log, { amount: "2" });

	// 				gasResults = Immutable.setIn(
	// 					gasResults,
	// 					[hasAllAssets, marketCount, method],
	// 					result2.gasUsed
	// 				);
	// 				console.log(result1, result2, expectedGas);
	// 				assert.withinGas(
	// 					result1,
	// 					expectedGas,
	// 					10000,
	// 					`should be about ${expectedGas} gas`,
	// 					true
	// 				);
	// 				assert.withinGas(
	// 					result2,
	// 					expectedGas,
	// 					10000,
	// 					`should be about ${expectedGas} gas`,
	// 					true
	// 				);
	// 			});
	// 		});
	// 	});
	// });

	describe("fallback", async () => {
		it("reverts on ether payment", async () => {
			// TODO: use .deployed()?
			const alkemiEarnVerified = await AlkemiEarnVerified.new().send({
				from: root,
			});
			await readAndExecContract(alkemiEarnVerified, "initializer", [], {
				from: root,
			});

			await assert.revert(
				fallback(alkemiEarnVerified, { value: 100, from: root })
			);
		});

		it("reverts when unpaid", async () => {
			// TODO: use .deployed()?
			const alkemiEarnVerified = await AlkemiEarnVerified.new().send({
				from: root,
			});
			await readAndExecContract(alkemiEarnVerified, "initializer", [], {
				from: root,
			});

			await assert.revert(
				fallback(alkemiEarnVerified, { value: 0, from: root })
			);
		});
	});

	describe("assetPrices", async () => {
		it("returns scaled price when available", async () => {
			const alkemiEarnVerified = await AlkemiEarnVerified.new().send({
				from: root,
			});
			await readAndExecContract(alkemiEarnVerified, "initializer", [], {
				from: root,
			});
			const priceOracle = await PriceOracle.new().send({ from: root });
			await alkemiEarnVerified.methods
				._adminFunctions(root, priceOracle._address, false, 1000000000000000,0,root,root)
				.send({ from: root });
			const OMG = await EIP20.new(
				(10 ** 18).toString(),
				"test omg",
				18,
				"omg"
			).send({
				from: root,
			});

			const price = getExpMantissa(0.0075);
			await priceOracle.methods
				.harnessSetAssetPrice(OMG._address, price)
				.send({ from: root });

			const result = await alkemiEarnVerified.methods
				.assetPrices(OMG._address)
				.call();
			assert.equal(result, price, "OMG price");
		});

		it("returns 0 when price not available", async () => {
			const alkemiEarnVerified = await AlkemiEarnVerified.new().send({
				from: root,
			});
			await readAndExecContract(alkemiEarnVerified, "initializer", [], {
				from: root,
			});
			const priceOracle = await PriceOracle.new().send({ from: root });
			await alkemiEarnVerified.methods
				._adminFunctions(root, priceOracle._address, false, 1000000000000000,0,root,root)
				.send({ from: root });
			const OMG = await EIP20.new(
				(10 ** 18).toString(),
				"test omg",
				18,
				"omg"
			).send({
				from: root,
			});

			const result = await alkemiEarnVerified.methods
				.assetPrices(OMG._address)
				.call();
			assert.equal(result, 0, "OMG should have no price");
		});
		// See test/AlkemiEarnVerified/AlkemiEarnVerifiedTest_AssetPrices.sol for test of unset oracle.
	});

	describe("_setPaused", async () => {
		it("contract is not paused when created", async () => {
			const alkemiEarnVerified = await AlkemiEarnVerified.new().send({
				from: root,
			});
			await readAndExecContract(alkemiEarnVerified, "initializer", [], {
				from: root,
			});

			const paused = await alkemiEarnVerified.methods.paused().call();
			assert.equal(
				paused,
				false,
				"newly-created contract should not be paused"
			);
		});

		it("changes state when requested by admin", async () => {
			const alkemiEarnVerified = await AlkemiEarnVerified.new().send({
				from: root,
			});
			await readAndExecContract(alkemiEarnVerified, "initializer", [], {
				from: root,
			});

			const [errorCode0, tx0, _error0] = await readAndExecContract(
				alkemiEarnVerified,
				"_adminFunctions",
				[accounts[0], accounts[0], true, 1000000000000000,0,accounts[0],accounts[0]],
				{ from: root, gas: 1000000 }
			);

			const paused = await alkemiEarnVerified.methods.paused().call();
			assert.equal(paused, true, "contract should be paused");

			const [errorCode1, tx1, _error1] = await readAndExecContract(
				alkemiEarnVerified,
				"_adminFunctions",
				[accounts[0], accounts[0], false, 1000000000000000,0,accounts[0],accounts[0]],
				{ from: root, gas: 1000000 }
			);
		});

		it("accepts non-state change", async () => {
			const alkemiEarnVerified = await AlkemiEarnVerified.new().send({
				from: root,
			});
			await readAndExecContract(alkemiEarnVerified, "initializer", [], {
				from: root,
			});

			const [errorCode, tx, _error] = await readAndExecContract(
				alkemiEarnVerified,
				"_adminFunctions",
				[accounts[0], accounts[0], false, 1000000000000000,0,accounts[0],accounts[0]],
				{ from: root, gas: 1000000 }
			);

			const paused = await alkemiEarnVerified.methods.paused().call();
			assert.equal(paused, false, "contract should not be paused");

		});
	});
});
