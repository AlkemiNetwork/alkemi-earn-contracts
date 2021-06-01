// migrations/4_prepare_upgrade_boxv2.js
const RewardControl = artifacts.require("RewardControl");

const { prepareUpgrade } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
	// const rewardControl = await RewardControl.deployed();
	// await prepareUpgrade(rewardControl.address, RewardControl, {
	// 	deployer,
	// 	unsafeAllowCustomTypes: true,
	// });
};
