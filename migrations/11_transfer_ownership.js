// migrations/3_transfer_ownership.js
const { admin } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer, network) {
	// Use address of your Gnosis Safe
	const gnosisSafe = "0x4A4396188308Ff2679c7fD7aa052b3713555dD15";

	// Don't change ProxyAdmin ownership for our test network
	if (network == "rinkeby") {
		// The owner of the ProxyAdmin can upgrade our contracts - do from our contract using _setPendingAdmin and _acceptAdmin functions
		// await admin.transferProxyAdminOwnership(gnosisSafe);
	}
};