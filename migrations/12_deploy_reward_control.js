var RewardControl = artifacts.require("RewardControl.sol");

const {deployProxy} = require("@openzeppelin/truffle-upgrades");

const deploymentConfig = require("./deployment-config.json");

module.exports = async (deployer, network, accounts) => {
    // await deployProxy(RewardControl, [deploymentConfig.RINKEBY.REWARD_CONTROL_OWNER, deploymentConfig.RINKEBY.MONEY_MARKET, deploymentConfig.RINKEBY.ALK_TOKEN], {
    //     deployer,
    //     initializer: "initializer",
    //     unsafeAllowCustomTypes: true,
    // });
};
