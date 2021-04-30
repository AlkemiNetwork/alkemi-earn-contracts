var AlkemiEarnPublicV10 = artifacts.require("AlkemiEarnPublicV10.sol");

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async (deployer, network, accounts) => {
	// await deployProxy(AlkemiEarnPublicV10, [], {
	// 	deployer,
	// 	initializer: "initializer",
	// 	unsafeAllowCustomTypes: true,
	// });
};
