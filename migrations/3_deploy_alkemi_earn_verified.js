var AlkemiEarnVerified = artifacts.require("AlkemiEarnVerified.sol");

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async (deployer, network, accounts) => {
	await deployProxy(AlkemiEarnVerified, [], {
		deployer,
		initializer: "initializer",
		unsafeAllowCustomTypes: true,
	});
};
