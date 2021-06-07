"use strict";

const { load } = require("./deployUtils");

const AlkemiEarnVerified = artifacts.require("./AlkemiEarnVerified.sol");
const Immutable = require("seamless-immutable");

const network = process.env["NETWORK"];
if (!network) {
	throw "NETWORK env var must be set";
}

async function setOracle() {
	const config = load(network);

	const alkemiEarnVerifiedAddress = Immutable.getIn(config, [
		"Contracts",
		"AlkemiEarnVerified",
	]);
	if (!alkemiEarnVerifiedAddress) {
		throw `No AlkemiEarnVerified address stored for network: ${network}`;
	}

	const oracleAddress =
		process.env["ORACLE_ADDRESS"] ||
		Immutable.getIn(config, ["Contracts", "PriceOracle"]);
	if (!oracleAddress) {
		throw "ORACLE_ADDRESS env var must be set";
	}

	console.log(`Setting oracle to ${oracleAddress}...`);
	const alkemiEarnVerified = AlkemiEarnVerified.at(alkemiEarnVerifiedAddress);

	const result = await alkemiEarnVerified._setOracle(oracleAddress);
	const error = result.logs.find((log) => log.event == "Failure");
	const log = result.logs.find((log) => log.event == "NewOracle");

	if (error) {
		throw `ErrorReporter Failure: Error=${error.args.error} Info=${error.args.info} Detail=${error.args.detail}`;
	}

	if (!log) {
		throw `Could not find log "NewOracle" in result logs [${result.logs
			.map((log) => log.event)
			.join(",")}]`;
	}

	console.log(`Setting oracle to ${oracleAddress} succeeded.`);
}

module.exports = setOracle;
