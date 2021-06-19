"use strict";

const Action = require("./Action");
const Immutable = require("seamless-immutable");
const {
	buildAlkemiEarnVerified,
	buildAlkemiEarnVerified2,
	buildPriceOracle,
	buildRewardControl,
} = require("./AlkemiEarnVerified");
const { ErrorEnumInv, FailureInfoEnumInv } = require("../ErrorReporter");
const BigNumber = require("bignumber.js");
const { getContract } = require("../Contract");

const accountMap = {
	root: 0,
	Bank: 1,
	Geoff: 2,
	Torrey: 3,
	Robert: 4,
	James: 5,
};

const startingBlockNumber = 1000;

function getUser(world, userArg) {
	const accountIndex = accountMap[userArg];

	if (accountIndex == undefined) {
		throw new Error(`Encountered unknown user: ${userArg}`);
	}

	return world.accounts[accountIndex];
}

function getToken(world, tokenArg) {
	return Immutable.getIn(world, ["tokens", tokenArg]);
}

function getAmount(world, amountArg) {
	if (amountArg === "MAX") {
		return new BigNumber(-1);
	} else {
		const number = new BigNumber(amountArg);

		if (number === NaN) {
			throw new Error(`Encountered invalid number: ${amountArg}`);
		} else {
			return number;
		}
	}
}

async function initWorld(accounts) {
	const priceOracle = await buildPriceOracle(accounts[0]);
	const alkemiEarnVerified = await buildAlkemiEarnVerified(
		accounts[0],
		accounts,
		priceOracle
	);

	await alkemiEarnVerified.methods
		.setBlockNumber(startingBlockNumber)
		.send({ from: accounts[0] });

	return Immutable({
		isWorld: true,
		actions: [],
		lastResult: undefined,
		lastTx: undefined,
		lastError: undefined,
		alkemiEarnVerified: alkemiEarnVerified,
		priceOracle: priceOracle,
		accounts: accounts,
		tokens: {},
		blockNumber: startingBlockNumber, // starting block number
	});
}

async function initWorldWithRewardDistribution(accounts) {
	const priceOracle = await buildPriceOracle(accounts[0]);
	const alkemiEarnVerified = await buildAlkemiEarnVerified2(
		accounts[0],
		accounts,
		priceOracle
	);
	const rewardControl = await buildRewardControl(accounts[0]);
	await alkemiEarnVerified.methods
		.setRewardControlAddress(rewardControl._address)
		.send({ from: accounts[0] });

	await alkemiEarnVerified.methods
		.setBlockNumber(startingBlockNumber)
		.send({ from: accounts[0] });

	await rewardControl.methods
		.harnessSetBlockNumber(startingBlockNumber)
		.send({ from: accounts[0] });

	return Immutable({
		isWorld: true,
		actions: [],
		lastResult: undefined,
		lastTx: undefined,
		lastError: undefined,
		alkemiEarnVerified: alkemiEarnVerified,
		priceOracle: priceOracle,
		rewardControl: rewardControl,
		accounts: accounts,
		tokens: {},
		blockNumber: startingBlockNumber, // starting block number
	});
}

function addAction(
	world,
	log,
	result,
	tx = null,
	error = null,
	resultIsError = false
) {
	let resultMessage;

	if (resultIsError) {
		resultMessage = `Error.${ErrorEnumInv[result]}`;
	} else {
		resultMessage = result;
	}

	const worldWithAction = Immutable.update(world, "actions", (actions) =>
		actions.concat([new Action(log, resultMessage)])
	);

	let lastError = undefined;

	if (error) {
		lastError = { success: false, thrownError: error };
	} else if (tx) {
		const log = tx.events["Failure"];

		if (log) {
			lastError = {
				success: false,
				error: ErrorEnumInv[log.returnValues[0]],
				info: FailureInfoEnumInv[log.returnValues[1]],
				detail: Number(log.returnValues[2]),
			};
		}
	}

	if (!lastError) {
		lastError = { success: true };
	}

	return Immutable.merge(worldWithAction, {
		lastResult: result,
		lastTx: tx,
		lastError: lastError,
	});
}

module.exports = {
	getAmount,
	getToken,
	getUser,
	initWorld,
	initWorldWithRewardDistribution,
	addAction,
};
