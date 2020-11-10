// migrations/4_prepare_upgrade_boxv2.js
const MoneyMarket = artifacts.require("MoneyMarket");
const MoneyMarketV2 = artifacts.require("MoneyMarketV2");

const { prepareUpgrade } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
	const moneyMarket = await MoneyMarket.deployed();
	await prepareUpgrade(moneyMarket.address, MoneyMarketV2, {
		deployer,
		unsafeAllowCustomTypes: true,
	});
};
