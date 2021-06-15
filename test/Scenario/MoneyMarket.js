"use strict";

const { getContract, readAndExecContract } = require("../Contract");
const PriceOracle = getContract("./test/PriceOracleHarness.sol");
const RewardControl = getContract("./test/RewardControlScenario.sol");
const MoneyMarket = getContract("./test/MoneyMarketScenario.sol");
const MoneyMarketV12 = getContract("./test/MoneyMarketV12Scenario.sol");

async function buildMoneyMarket(root, accounts, priceOracle) {
	const moneyMarket = await MoneyMarket.new().send({ from: root });
	await readAndExecContract(moneyMarket, "initializer", [], { from: root });
	await readAndExecContract(moneyMarket, "addKYCAdmin", [root], { from: root });
	await readAndExecContract(moneyMarket, "addCustomerKYC", [root], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addCustomerKYC", [accounts[1]], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addCustomerKYC", [accounts[2]], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addCustomerKYC", [accounts[3]], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addCustomerKYC", [accounts[4]], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addCustomerKYC", [accounts[5]], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addCustomerKYC", [accounts[6]], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addCustomerKYC", [accounts[7]], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addCustomerKYC", [accounts[8]], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addCustomerKYC", [accounts[9]], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addLiquidator", [root], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addLiquidator", [accounts[1]], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addLiquidator", [accounts[2]], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addLiquidator", [accounts[3]], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addLiquidator", [accounts[4]], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addLiquidator", [accounts[5]], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addLiquidator", [accounts[6]], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addLiquidator", [accounts[7]], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addLiquidator", [accounts[8]], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "addLiquidator", [accounts[9]], {
		from: root,
	});

	await moneyMarket.methods
		._setOracle(priceOracle._address)
		.send({ from: root });

	// TODO: Should we set default origination fee here?

	return {
		_address: moneyMarket._address,
		name: "MoneyMarket",
		methods: moneyMarket.methods,
	};
}

async function buildMoneyMarketV12(root, accounts, priceOracle) {
	const moneyMarket = await MoneyMarketV12.new().send({ from: root });
	await readAndExecContract(moneyMarket, "initializer", [], { from: root });
	await readAndExecContract(moneyMarket, "_changeKYCAdmin", [root, true], { from: root });
	await readAndExecContract(moneyMarket, "_changeCustomerKYC", [root, true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeCustomerKYC", [accounts[1], true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeCustomerKYC", [accounts[2], true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeCustomerKYC", [accounts[3], true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeCustomerKYC", [accounts[4], true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeCustomerKYC", [accounts[5], true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeCustomerKYC", [accounts[6], true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeCustomerKYC", [accounts[7], true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeCustomerKYC", [accounts[8], true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeCustomerKYC", [accounts[9], true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeLiquidator", [root, true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeLiquidator", [accounts[1], true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeLiquidator", [accounts[2], true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeLiquidator", [accounts[3], true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeLiquidator", [accounts[4], true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeLiquidator", [accounts[5], true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeLiquidator", [accounts[6], true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeLiquidator", [accounts[7], true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeLiquidator", [accounts[8], true], {
		from: root,
	});
	await readAndExecContract(moneyMarket, "_changeLiquidator", [accounts[9], true], {
		from: root,
	});

	await moneyMarket.methods
		._adminFunctions(root, priceOracle._address, false)
		.send({ from: root });

	// TODO: Should we set default origination fee here?

	return {
		_address: moneyMarket._address,
		name: "MoneyMarket",
		methods: moneyMarket.methods,
	};
}

async function buildPriceOracle(root) {
	const priceOracle = await PriceOracle.new().send({ from: root });

	// TODO: Should we set default origination fee here?

	return {
		_address: priceOracle._address,
		name: "PriceOracle",
		methods: priceOracle.methods,
	};
}

async function buildRewardControl(root) {
	const rewardControl = await RewardControl.new().send({ from: root });

	return {
		_address: rewardControl._address,
		name: "RewardControl",
		methods: rewardControl.methods,
	};
}

module.exports = {
	buildMoneyMarket,
	buildMoneyMarketV12,
	buildPriceOracle,
	buildRewardControl
};
