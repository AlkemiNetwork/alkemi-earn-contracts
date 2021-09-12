var RewardControl = artifacts.require("RewardControl.sol");

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

const deploymentConfig = require("./deployment-config.json");

module.exports = async (deployer, network, accounts) => {
	await deployProxy(
		RewardControl,
		[
			deploymentConfig.MAINNET.REWARD_CONTROL_OWNER,
			deploymentConfig.MAINNET.ALKEMI_EARN_VERIFIED,
			deploymentConfig.MAINNET.ALKEMI_EARN_PUBLIC,
			deploymentConfig.MAINNET.ALK_TOKEN,
		],
		{
			deployer,
			initializer: "initializer",
			unsafeAllowCustomTypes: true,
		}
	);
};
