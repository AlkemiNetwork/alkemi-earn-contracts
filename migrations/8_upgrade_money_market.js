// migrations/4_prepare_upgrade_boxv2.js
const MoneyMarket = artifacts.require("MoneyMarket");

const { prepareUpgrade } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
	const moneyMarket = await MoneyMarket.deployed();
	await prepareUpgrade(moneyMarket.address, MoneyMarket, {
		deployer,
		unsafeAllowCustomTypes: true,
	});
};
