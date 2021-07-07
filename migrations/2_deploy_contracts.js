var PriceOracle = artifacts.require("PriceOracle.sol");
var PriceOracleProxy = artifacts.require("PriceOracleProxy.sol");
var AlkemiEarnVerified = artifacts.require("AlkemiEarnVerified.sol");
var AlkemiEarnPublic = artifacts.require("AlkemiEarnPublic.sol");
var Liquidator = artifacts.require("Liquidator.sol");
var LiquidationChecker = artifacts.require("LiquidationChecker.sol");
var ChainLink = artifacts.require("ChainLink.sol");
var AlkemiWETH = artifacts.require("AlkemiWETH.sol");
var AlkemiRateModel = artifacts.require("AlkemiRateModel.sol");
var RewardControl = artifacts.require("RewardControl.sol");

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

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
		await deployer.deploy(AlkemiEarnVerified);
		await deployer.deploy(ChainLink);
		await deployer.deploy(AlkemiWETH);

		await deployer.deploy(Liquidator, AlkemiEarnVerified.address);
		const alkemiEarnVerified = await AlkemiEarnVerified.deployed();
		const liquidator = await AlkemiEarnVerified.deployed();

		await deployer.deploy(
			AlkemiRateModel,
			"Rate Model",
			50,
			2000,
			100,
			8000,
			400,
			3000
		);
		await alkemiEarnVerified._adminFunctions(
			accounts[0],
			priceOracle.address,
			false,
			1000000000000000,
			0
		);
		// await deployer.deploy(
		// 	LiquidationChecker,
		// 	AlkemiEarnVerified.address,
		// 	Liquidator.address,
		// 	true
		// );
	} else if (network == "rinkeby") {
		const alkemiEarnVerified = await deployProxy(AlkemiEarnVerified, [], {
			deployer,
			initializer: "initializer",
			unsafeAllowCustomTypes: true,
		});
		await alkemiEarnVerified._adminFunctions(
			accounts[0],
			deploymentConfig.RINKEBY.PRICE_ORACLE,
			false,
			1000000000000000,
			0
		);
		await alkemiEarnVerified._supportMarket(
			deploymentConfig.RINKEBY.USDC,
			deploymentConfig.RINKEBY.USDC_RATE_MODEL
		);
		await alkemiEarnVerified._changeKYCAdmin(accounts[0], true);
		await alkemiEarnVerified._changeCustomerKYC(accounts[0], true);

		const rewardControl = await deployProxy(
			RewardControl,
			[
				accounts[0],
				alkemiEarnVerified.address,
				deploymentConfig.RINKEBY.ALK_TOKEN,
			],
			{
				deployer,
				initializer: "initializer",
				unsafeAllowCustomTypes: true,
			}
		);
		await alkemiEarnVerified.setRewardControlAddress(rewardControl.address);
		await rewardControl.addMarket(deploymentConfig.RINKEBY.USDC);
		// await deployer.deploy(PriceOracle, deploymentConfig.RINKEBY.POSTER);
		// await deployer.deploy(
		// 	PriceOracleProxy,
		// 	deploymentConfig.RINKEBY.PriceOracle
		// );
		// await deployer.deploy(AlkemiEarnVerified);
		// await deployer.deploy(AlkemiEarnPublic);
		// await deployer.deploy(ChainLink);
		// await deployer.deploy(AlkemiWETH);
		// await deployer.deploy(Liquidator, deploymentConfig.RINKEBY.ALKEMI_EARN_VERIFIED);
		// await deployer.deploy(
		// 	LiquidationChecker,
		// 	deploymentConfig.RINKEBY.AlkemiEarnVerified,
		// 	deploymentConfig.RINKEBY.Liquidator,
		// 	true
		// );
		// await deployer.deploy(
		// 	AlkemiRateModel,
		// 	"BTC Rate Model",
		// 	100,
		// 	200,
		// 	250,
		// 	8000,
		// 	3000,
		// 	5000
		// );
		// await deployer.deploy(
		// 	AlkemiRateModel,
		// 	"ETH Rate Model",
		// 	100,
		// 	400,
		// 	250,
		// 	8000,
		// 	1100,
		// 	3000
		// );
		// await deployer.deploy(
		// 	AlkemiRateModel,
		// 	"Stable Coin Rate Model",
		// 	100,
		// 	2000,
		// 	100,
		// 	8000,
		// 	400,
		// 	3000
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
		// await deployer.deploy(AlkemiEarnVerified);
		// const oracle = await ChainLink.deployed();
		// const alkemiEarnVerified = await AlkemiEarnVerified.deployed();
		// await alkemiEarnVerified._setOracle(oracle.address);
		// await deployer.deploy(Liquidator, AlkemiEarnVerified.address);
		// await deployer.deploy(
		// 	LiquidationChecker,
		// 	AlkemiEarnVerified.address,
		// 	Liquidator.address
		// );
	} else if (network == "kovan") {
		// await deployer.deploy(PriceOracle, deploymentConfig.KOVAN.POSTER);
		// await deployer.deploy(PriceOracleProxy, PriceOracle.address);
		await deployer.deploy(AlkemiEarnVerified);
		// await deployer.deploy(Liquidator, AlkemiEarnVerified.address);
		// await deployer.deploy(ChainLink);
		// await deployer.deploy(AlkemiEarnVerified);
		// await deployer.deploy(AlkemiWETH);
		// await deployer.deploy(StandardInterestRateModel);
	} else if (network == "mainnet") {
		// await deployer.deploy(PriceOracle, deploymentConfig.RINKEBY.POSTER);
		// await deployer.deploy(
		// 	PriceOracleProxy,
		// 	deploymentConfig.RINKEBY.PriceOracle
		// );
		// await deployer.deploy(AlkemiEarnVerified);
		// await deployer.deploy(ChainLink);
		// await deployer.deploy(AlkemiEarnVerified);
		// await deployer.deploy(Liquidator, deploymentConfig.RINKEBY.ALKEMI_EARN_VERIFIED);
		// await deployer.deploy(
		// 	LiquidationChecker,
		// 	deploymentConfig.RINKEBY.AlkemiEarnVerified,
		// 	deploymentConfig.RINKEBY.Liquidator,
		// 	true
		// );
		await deployer.deploy(
			AlkemiRateModel,
			"BTC Rate Model",
			100,
			200,
			250,
			8000,
			3000,
			5000
		);
		await deployer.deploy(
			AlkemiRateModel,
			"ETH Rate Model",
			100,
			400,
			250,
			8000,
			1100,
			3000
		);
		await deployer.deploy(
			AlkemiRateModel,
			"Stable Coin Rate Model",
			100,
			2000,
			100,
			8000,
			400,
			3000
		);
	} else {
		// await deployer.deploy(PriceOracle, deploymentConfig.MAINNET.POSTER);
		// await deployer.deploy(PriceOracleProxy, PriceOracle.address);
		// await deployer.deploy(AlkemiEarnVerified);
	}
};
