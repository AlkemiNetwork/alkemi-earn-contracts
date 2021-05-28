// migrations/4_prepare_upgrade_boxv2.js
const MoneyMarketV11 = artifacts.require("MoneyMarket");
const AlkemiEarnVerified = artifacts.require("AlkemiEarnVerified");
// Upgrades using Truffle plugin is not required anymore. Use direct deployment and upgrade using Gnosis Safe
const {
	prepareUpgrade,
	upgradeProxy,
} = require("@openzeppelin/truffle-upgrades");

module.exports = async function(deployer) {
	const moneyMarketV11 = await MoneyMarketV11.deployed();
	// await upgradeProxy(
	// 	"0x8770B2a109AEE8CDbe278FaE6CaE5Aa4Bcd13E1c",
	// 	AlkemiEarnVerified,
	// 	{
	// 		deployer,
	// 		unsafeAllowCustomTypes: true,
	// 	}
	// );
};
