var PriceOracle = artifacts.require("PriceOracle.sol");
var PriceOracleProxy = artifacts.require("PriceOracleProxy.sol");
var MoneyMarket = artifacts.require("MoneyMarket.sol");
var MoneyMarketV12 = artifacts.require("MoneyMarketV12.sol");
var RewardControl = artifacts.require("RewardControl.sol");
var Liquidator = artifacts.require("Liquidator.sol");
var LiquidationChecker = artifacts.require("LiquidationChecker.sol");
var ChainLink = artifacts.require("ChainLink.sol");
var AlkemiWETH = artifacts.require("AlkemiWETH.sol");
var AlkemiRateModel = artifacts.require("AlkemiRateModel.sol");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

// var StandardInterestRateModel = artifacts.require(
// 	"./StandardInterestRateModel.sol"
// );
var TestTokens = artifacts.require("TestTokens.sol");

const deploymentConfig = require("./deployment-config.json");

module.exports = async (deployer, network, accounts) => {
	if (
		network == "development" ||
		network == "ganacheUI" ||
		network == "coverage" ||
		network == "soliditycoverage"
	) {
		await deployer.deploy(PriceOracle, deploymentConfig.DEVCHAIN.POSTER);
		const priceOracle = await PriceOracle.deployed();
		await deployer.deploy(PriceOracleProxy, priceOracle.address);
		await deployer.deploy(MoneyMarket);
		await deployer.deploy(ChainLink);
		await deployer.deploy(AlkemiWETH);

		await deployer.deploy(Liquidator, MoneyMarket.address);
		const moneyMarket = await MoneyMarket.deployed();
		const liquidator = await MoneyMarket.deployed();

		await deployer.deploy(
			AlkemiRateModel,
			"Rate Model",
			50,
			2000,
			100,
			8000,
			400,
			3000,
			moneyMarket.address,
			liquidator.address
		);
		await moneyMarket._setOracle(priceOracle.address);
		// await deployer.deploy(
		// 	LiquidationChecker,
		// 	MoneyMarket.address,
		// 	Liquidator.address,
		// 	true
		// );
	} else if (network == "rinkeby") {
		const moneyMarket = await deployProxy(MoneyMarketV12, [], {
			deployer,
			initializer: "initializer",
			unsafeAllowCustomTypes: true,
		});
		await moneyMarket._adminFunctions(
			address[0],
			deploymentConfig.RINKEBY.PRICE_ORACLE,
			false,
			0
		);
		await moneyMarket._supportMarket(
			deploymentConfig.RINKEBY.USDC,
			deploymentConfig.RINKEBY.USDC_RATE_MODEL
		);
		await moneyMarket._changeKYCAdmin(accounts[0], true);
		await moneyMarket._changeCustomerKYC(accounts[0], true);

		const rewardControl = await deployProxy(
			RewardControl,
			[accounts[0], moneyMarket.address, deploymentConfig.RINKEBY.ALK_TOKEN],
			{
				deployer,
				initializer: "initializer",
				unsafeAllowCustomTypes: true,
			}
		);
		await moneyMarket.setRewardControlAddress(rewardControl.address);
		await rewardControl.addMarket(deploymentConfig.RINKEBY.USDC);

		// Transfer rewardControl.address 70M ALK for reward distribution.
		// User can then start using the MoneyMarket contract.
		// 1. User needs to have some USDC in this case, probably from UNISWAP.
		// 2. User needs to call `approve` function on USDC contract to grant MoneyMarket as his/her spender.
		// 3. User needs to call `supply` function with his/her USDC assets on MoneyMarket contract.

		//
		// await deployer.deploy(PriceOracle, deploymentConfig.RINKEBY.POSTER);
		// await deployer.deploy(
		// 	PriceOracleProxy,
		// 	deploymentConfig.RINKEBY.PriceOracle
		// );
		// await deployer.deploy(ChainLink);
		// await deployer.deploy(AlkemiWETH);
		// await deployer.deploy(Liquidator, deploymentConfig.RINKEBY.MONEY_MARKET);
		// await deployer.deploy(
		// 	LiquidationChecker,
		// 	deploymentConfig.RINKEBY.MoneyMarket,
		// 	deploymentConfig.RINKEBY.Liquidator,
		// 	true
		// );
	} else if (network == "ropsten") {
		// await deployer.deploy(PriceOracle, deploymentConfig.ROPSTEN.POSTER);
		// await deployer.deploy(
		// 	PriceOracleProxy,
		// 	deploymentConfig.ROPSTEN.PRICE_ORACLE
		// );
		// await deployer.deploy(
		// 	TestTokens,
		// 	"Maker DAO",
		// 	"DAI",
		// 	18,
		// 	1000000 // Supply 18 decimals handled in constructor
		// );
		// await deployer.deploy(ChainLink);
		// await deployer.deploy(AlkemiWETH);
		// await deployer.deploy(MoneyMarket);
		// const oracle = await ChainLink.deployed();
		// const moneyMarket = await MoneyMarket.deployed();
		// await moneyMarket._setOracle(oracle.address);
		// await deployer.deploy(Liquidator, MoneyMarket.address);
		// await deployer.deploy(
		// 	LiquidationChecker,
		// 	MoneyMarket.address,
		// 	Liquidator.address
		// );
	} else if (network == "kovan") {
		// await deployer.deploy(PriceOracle, deploymentConfig.KOVAN.POSTER);
		// await deployer.deploy(PriceOracleProxy, PriceOracle.address);
		await deployer.deploy(MoneyMarket);
		// await deployer.deploy(Liquidator, MoneyMarket.address);
		// await deployer.deploy(ChainLink);
		// await deployer.deploy(MoneyMarket);
		// await deployer.deploy(AlkemiWETH);
		// await deployer.deploy(StandardInterestRateModel);
	} else if (network == "mainnet") {
		// await deployer.deploy(PriceOracle, deploymentConfig.RINKEBY.POSTER);
		// await deployer.deploy(
		// 	PriceOracleProxy,
		// 	deploymentConfig.RINKEBY.PriceOracle
		// );
		// await deployer.deploy(MoneyMarket);
		// await deployer.deploy(ChainLink);
		await deployer.deploy(AlkemiWETH);
		// await deployer.deploy(Liquidator, deploymentConfig.RINKEBY.MONEY_MARKET);
		// await deployer.deploy(
		// 	LiquidationChecker,
		// 	deploymentConfig.RINKEBY.MoneyMarket,
		// 	deploymentConfig.RINKEBY.Liquidator,
		// 	true
		// );
	} else {
		// await deployer.deploy(PriceOracle, deploymentConfig.MAINNET.POSTER);
		// await deployer.deploy(PriceOracleProxy, PriceOracle.address);
		// await deployer.deploy(MoneyMarket);
	}
};
