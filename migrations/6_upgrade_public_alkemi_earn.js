// migrations/4_prepare_upgrade_boxv2.js
const AlkemiEarnPublic = artifacts.require("AlkemiEarnPublic");
// const AlkemiEarnPublicV11 = artifacts.require("AlkemiEarnPublicV11");
// Upgrades using Truffle plugin is not required anymore. Use direct deployment and upgrade using Gnosis Safe
const { prepareUpgrade } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
	// const alkemiEarnPublic = await AlkemiEarnPublic.deployed();
	// await prepareUpgrade(alkemiEarnPublic.address, AlkemiEarnPublic, {
	// 	deployer,
	// 	unsafeAllowCustomTypes: true,
	// });
};
