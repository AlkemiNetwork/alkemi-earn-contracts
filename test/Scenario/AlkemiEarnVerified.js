"use strict";

const { getContract, readAndExecContract } = require("../Contract");
const AlkemiEarnVerified = getContract("./test/AlkemiEarnVerifiedScenario.sol");
const PriceOracle = getContract("./test/PriceOracleHarness.sol");

async function buildAlkemiEarnVerified(root, accounts, priceOracle) {
	const alkemiEarnVerified = await AlkemiEarnVerified.new().send({
		from: root,
	});
	await readAndExecContract(alkemiEarnVerified, "initializer", [], {
		from: root,
	});
	await readAndExecContract(alkemiEarnVerified, "addKYCAdmin", [root], {
		from: root,
	});
	await readAndExecContract(alkemiEarnVerified, "addCustomerKYC", [root], {
		from: root,
	});
	await readAndExecContract(
		alkemiEarnVerified,
		"addCustomerKYC",
		[accounts[1]],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"addCustomerKYC",
		[accounts[2]],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"addCustomerKYC",
		[accounts[3]],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"addCustomerKYC",
		[accounts[4]],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"addCustomerKYC",
		[accounts[5]],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"addCustomerKYC",
		[accounts[6]],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"addCustomerKYC",
		[accounts[7]],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"addCustomerKYC",
		[accounts[8]],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"addCustomerKYC",
		[accounts[9]],
		{
			from: root,
		}
	);
	await readAndExecContract(alkemiEarnVerified, "addLiquidator", [root], {
		from: root,
	});
	await readAndExecContract(
		alkemiEarnVerified,
		"addLiquidator",
		[accounts[1]],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"addLiquidator",
		[accounts[2]],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"addLiquidator",
		[accounts[3]],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"addLiquidator",
		[accounts[4]],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"addLiquidator",
		[accounts[5]],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"addLiquidator",
		[accounts[6]],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"addLiquidator",
		[accounts[7]],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"addLiquidator",
		[accounts[8]],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"addLiquidator",
		[accounts[9]],
		{
			from: root,
		}
	);

	await alkemiEarnVerified.methods
		._setOracle(priceOracle._address)
		.send({ from: root });

	// TODO: Should we set default origination fee here?

	return {
		_address: alkemiEarnVerified._address,
		name: "AlkemiEarnVerified",
		methods: alkemiEarnVerified.methods,
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
	buildAlkemiEarnVerified,
	buildPriceOracle,
};
