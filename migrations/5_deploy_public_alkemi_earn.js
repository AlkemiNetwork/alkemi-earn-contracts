var AlkemiEarnPublic = artifacts.require("AlkemiEarnPublic.sol");

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async (deployer, network, accounts) => {
	await deployProxy(AlkemiEarnPublic, [], {
		deployer,
		initializer: "initializer",
		unsafeAllowCustomTypes: true,
	});
};
