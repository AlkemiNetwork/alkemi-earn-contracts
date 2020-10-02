var PriceOracle = artifacts.require("PriceOracle.sol");
var PriceOracleProxy = artifacts.require("PriceOracleProxy.sol");
var MoneyMarket = artifacts.require("./MoneyMarket.sol");
var Liquidator = artifacts.require("./Liquidator.sol");
var LiquidationChecker = artifacts.require("./LiquidationChecker.sol");
var StandardInterestRateModel = artifacts.require(
	"./StandardInterestRateModel.sol"
);

const deploymentConfig = require("./deployment-config.json");

module.exports = async (deployer, network, accounts) => {
	if (network == "development" || network == "ganacheUI") {
		await deployer.deploy(PriceOracle, deploymentConfig.DEVCHAIN.POSTER);
		await deployer.deploy(PriceOracleProxy, PriceOracle.address);
		await deployer.deploy(MoneyMarket);
	} else if (network == "rinkeby") {
		await deployer.deploy(PriceOracle, deploymentConfig.RINKEBY.POSTER);
		await deployer.deploy(
			PriceOracleProxy,
			deploymentConfig.RINKEBY.PriceOracle
		);
		await deployer.deploy(MoneyMarket);
		await deployer.deploy(Liquidator, deploymentConfig.RINKEBY.MONEY_MARKET);
		await deployer.deploy(
			LiquidationChecker,
			deploymentConfig.RINKEBY.MoneyMarket,
			deploymentConfig.RINKEBY.Liquidator,
			true
		);
	} else if (network == "ropsten") {
		await deployer.deploy(PriceOracle, deploymentConfig.ROPSTEN.POSTER);
		await deployer.deploy(
			PriceOracleProxy,
			deploymentConfig.ROPSTEN.PRICE_ORACLE
		);
		await deployer.deploy(MoneyMarket);
		await deployer.deploy(Liquidator, MoneyMarket.address);
		// await deployer.deploy(
		// 	LiquidationChecker,
		// 	MoneyMarket.address,
		// 	Liquidator.address
		// );
	} else if (network == "kovan") {
		// await deployer.deploy(PriceOracle, deploymentConfig.KOVAN.POSTER);
		// await deployer.deploy(PriceOracleProxy, PriceOracle.address);
		// await deployer.deploy(MoneyMarket, PriceOracle.address);
		// await deployer.deploy(Liquidator, MoneyMarket.address);
		await deployer.deploy(StandardInterestRateModel);
	} else {
		await deployer.deploy(PriceOracle, deploymentConfig.MAINNET.POSTER);
		await deployer.deploy(PriceOracleProxy, PriceOracle.address);
		await deployer.deploy(MoneyMarket);
	}
};
