var PriceOracle = artifacts.require("PriceOracle.sol");
var PriceOracleProxy = artifacts.require("PriceOracleProxy.sol");
var MoneyMarket = artifacts.require("./MoneyMarket.sol");
var StandardInterestRateModel = artifacts.require(
	"./StandardInterestRateModel.sol"
);

const deploymentConfig = require("./deployment-config.json");

module.exports = async (deployer, network, accounts) => {
	if (network == "development" || network == "ganacheUI") {
		const priceOracle = await PriceOracle.deployed();
		const moneyMarket = await MoneyMarket.deployed();
		await moneyMarket._setOracle(priceOracle.address);
	} else if (network == "rinkeby") {
		const priceOracle = await PriceOracle.deployed();
		const moneyMarket = await MoneyMarket.deployed();
		await moneyMarket._setOracle(priceOracle.address);
	} else if (network == "kovan") {
		const priceOracle = await PriceOracle.deployed();
		const moneyMarket = await MoneyMarket.deployed();
		await moneyMarket._setOracle(priceOracle.address);
		const standardInterestRateModel = await StandardInterestRateModel.deployed();
	} else if (network == "ropsten") {
		const priceOracle = await PriceOracle.deployed();
		const moneyMarket = await MoneyMarket.deployed();
		await moneyMarket._setOracle(priceOracle.address);
		// const standardInterestRateModel = await StandardInterestRateModel.deployed();
	} else {
		const priceOracle = await PriceOracle.deployed();
		const moneyMarket = await MoneyMarket.deployed();
		await moneyMarket._setOracle(priceOracle.address);
	}
};
