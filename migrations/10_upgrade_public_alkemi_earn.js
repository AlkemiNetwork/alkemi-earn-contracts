// migrations/4_prepare_upgrade_boxv2.js
const AlkemiEarnPublicV10 = artifacts.require("AlkemiEarnPublicV10");
// const AlkemiEarnPublicV11 = artifacts.require("AlkemiEarnPublicV11");
// Upgrades using Truffle plugin is not required anymore. Use direct deployment and upgrade using Gnosis Safe
const { prepareUpgrade } = require("@openzeppelin/truffle-upgrades");

module.exports = async function(deployer) {
	// const alkemiEarnPublic = await AlkemiEarnPublicV10.deployed();
	// await prepareUpgrade(alkemiEarnPublic.address, AlkemiEarnPublicV11, {
	// 	deployer,
	// 	unsafeAllowCustomTypes: true,
	// });
};
