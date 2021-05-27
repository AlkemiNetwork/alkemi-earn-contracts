// migrations/4_prepare_upgrade_boxv2.js
const MoneyMarket = artifacts.require("MoneyMarket");
const MoneyMarketV12 = artifacts.require("MoneyMarketV12");

const { prepareUpgrade } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
	// const moneyMarket = await MoneyMarket.deployed();
	// await prepareUpgrade(moneyMarket.address, MoneyMarketV12, {
	// 	deployer,
	// 	unsafeAllowCustomTypes: true,
	// });
};
