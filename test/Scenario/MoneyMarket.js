"use strict";

const { getContract, readAndExecContract } = require("../Contract");
const MoneyMarket = getContract("./test/MoneyMarketScenario.sol");
const PriceOracle = getContract("./test/PriceOracleHarness.sol");

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

async function buildPriceOracle(root) {
	const priceOracle = await PriceOracle.new().send({ from: root });

	// TODO: Should we set default origination fee here?

	return {
		_address: priceOracle._address,
		name: "PriceOracle",
		methods: priceOracle.methods,
	};
}

module.exports = {
	buildMoneyMarket,
	buildPriceOracle,
};
