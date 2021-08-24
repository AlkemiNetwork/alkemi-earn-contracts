"use strict";

const { getContract, readAndExecContract } = require("../Contract");
const PriceOracle = getContract("./test/PriceOracleHarness.sol");
const RewardControl = getContract("./test/RewardControlScenario.sol");
const AlkemiEarnVerified = getContract("./test/AlkemiEarnVerifiedScenario.sol");
const AlkemiEarnVerified2 = getContract(
	"./test/AlkemiEarnVerifiedScenario2.sol"
);

async function buildAlkemiEarnVerified(root, accounts, priceOracle) {
	const alkemiEarnVerified = await AlkemiEarnVerified.new().send({
		from: root,
	});
	await readAndExecContract(alkemiEarnVerified, "initializer", [], {
		from: root,
	});
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeKYCAdmin",
		[root, true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[root, true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[accounts[1], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[accounts[2], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[accounts[3], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[accounts[4], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[accounts[5], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[accounts[6], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[accounts[7], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[accounts[8], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[accounts[9], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[root, true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[accounts[1], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[accounts[2], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[accounts[3], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[accounts[4], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[accounts[5], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[accounts[6], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[accounts[7], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[accounts[8], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[accounts[9], true],
		{
			from: root,
		}
	);

	await alkemiEarnVerified.methods
		._adminFunctions(root, priceOracle._address, false, 1000000000000000,0,root,root)
		.send({ from: root });

	// TODO: Should we set default origination fee here?

	return {
		_address: alkemiEarnVerified._address,
		name: "AlkemiEarnVerified",
		methods: alkemiEarnVerified.methods,
	};
}

async function buildAlkemiEarnVerified2(root, accounts, priceOracle) {
	const alkemiEarnVerified = await AlkemiEarnVerified2.new().send({
		from: root,
	});
	await readAndExecContract(alkemiEarnVerified, "initializer", [], {
		from: root,
	});
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeKYCAdmin",
		[root, true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[root, true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[accounts[1], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[accounts[2], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[accounts[3], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[accounts[4], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[accounts[5], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[accounts[6], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[accounts[7], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[accounts[8], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeCustomerKYC",
		[accounts[9], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[root, true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[accounts[1], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[accounts[2], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[accounts[3], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[accounts[4], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[accounts[5], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[accounts[6], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[accounts[7], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[accounts[8], true],
		{
			from: root,
		}
	);
	await readAndExecContract(
		alkemiEarnVerified,
		"_changeLiquidator",
		[accounts[9], true],
		{
			from: root,
		}
	);

	await alkemiEarnVerified.methods
		._adminFunctions(root, priceOracle._address, false, 1000000000000000,0,root,root)
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

async function buildRewardControl(root) {
	const rewardControl = await RewardControl.new().send({ from: root });

	return {
		_address: rewardControl._address,
		name: "RewardControl",
		methods: rewardControl.methods,
	};
}

module.exports = {
	buildAlkemiEarnVerified,
	buildAlkemiEarnVerified2,
	buildPriceOracle,
	buildRewardControl,
};
