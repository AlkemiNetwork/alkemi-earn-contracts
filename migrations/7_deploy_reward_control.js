var RewardControl = artifacts.require("RewardControl.sol");

const {deployProxy} = require("@openzeppelin/truffle-upgrades");

const deploymentConfig = require("./deployment-config.json");

module.exports = async (deployer, network, accounts) => {
    // await deployProxy(RewardControl, [deploymentConfig.RINKEBY.REWARD_CONTROL_OWNER, deploymentConfig.RINKEBY.ALKEMI_EARN_VERIFIED, deploymentConfig.RINKEBY.ALK_TOKEN], {
    //     deployer,
    //     initializer: "initializer",
    //     unsafeAllowCustomTypes: true,
    // });
};
