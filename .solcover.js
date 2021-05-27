module.exports = {
	port: 8555,
	// testCommand: "npm run test",
	skipFiles: [
		"ChainLink.sol",
		"PriceOracle.sol",
		"PriceOracleProxy.sol",
		"AggregatorV3Interface.sol",
		"JumpRateModel.sol",
		"JumpRateModelV2.sol",
		"PriceOracleInterface.sol",
		"LiquidationChecker.sol",
		"Liquidator.sol",
	],
};
