var MoneyMarket = artifacts.require("MoneyMarket.sol");

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async (deployer, network, accounts) => {
	// await deployProxy(MoneyMarket, [], {
	// 	deployer,
	// 	initializer: "initializer",
	// 	unsafeAllowCustomTypes: true,
	// });
};
