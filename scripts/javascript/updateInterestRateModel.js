"use strict";

const { load, deployNew } = require("./deployUtils");
const AlkemiEarnVerified = artifacts.require("./AlkemiEarnVerified.sol");
const network = process.env["NETWORK"];
const updateAlkemiEarnVerified = process.env["UPDATE_ALKEMI_EARN_VERIFIED"];
const Immutable = require("seamless-immutable");

if (!network) {
	throw "NETWORK env var must be set";
}

const asset = process.env["ASSET"];
if (!asset) {
	throw "ASSET env var must be set";
}

const interestRateModel = process.env["INTEREST_RATE_MODEL"];
if (!interestRateModel) {
	throw "INTEREST_RATE_MODEL env var must be set";
}

async function updateInterestRateModel() {
	try {
		const config = load(network);

		const alkemiEarnVerifiedAddress = Immutable.getIn(config, [
			"Contracts",
			"AlkemiEarnVerified",
		]);
		if (!alkemiEarnVerifiedAddress) {
			throw `No AlkemiEarnVerified address stored for network: ${network}`;
		}

		let interestRateModelAddress = Immutable.getIn(config, [
			"Contracts",
			interestRateModel,
		]);
		if (!interestRateModelAddress) {
			const modelContract = artifacts.require(`./${interestRateModel}.sol`);
			const freshInterestRateModel = await deployNew(
				network,
				modelContract,
				[],
				true,
				true,
				"",
				interestRateModel
			);
			interestRateModelAddress = freshInterestRateModel.address;
		}

		const assetConfig = Immutable.getIn(config, ["Tokens", asset]);
		if (!assetConfig) {
			throw `No asset address stored for: ${asset} on ${network}`;
		}

		if (updateAlkemiEarnVerified !== "no_thanks") {
			console.log(
				`Setting interest rate model for ${assetConfig.name} to ${interestRateModel}...`
			);
			const alkemiEarnVerified = AlkemiEarnVerified.at(
				alkemiEarnVerifiedAddress
			);

			const result = await alkemiEarnVerified._setMarketInterestRateModel(
				assetConfig.address,
				interestRateModelAddress
			);

			const error = result.logs.find((log) => log.event == "Failure");
			const log = result.logs.find(
				(log) => log.event == "SetMarketInterestRateModel"
			);

			if (error) {
				throw `ErrorReporter Failure: Error=${error.args.error} Info=${error.args.info} Detail=${error.args.detail}`;
			}

			if (!log) {
				throw `Could not find log "SetMarketInterestRateModel" in result logs [${result.logs
					.map((log) => log.event)
					.join(",")}]`;
			}

			console.log(
				`Setting interest rate model for ${asset} to ${interestRateModel}: ${interestRateModelAddress} succeeded.`
			);
		} else {
			console.log(
				`deployed or found ${interestRateModel}: ${interestRateModelAddress}, but did not update alkemi earn verified`
			);
		}
	} catch (e) {
		console.log(e);
	}
}

module.exports = updateInterestRateModel;
