// migrations/3_transfer_ownership.js
const { admin } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer, network) {
	// Use address of your Gnosis Safe
	const gnosisSafe = "0x9ea4613fEe81338ba6F532a93d3Cb2f09AB07BBF";

	// Don't change ProxyAdmin ownership for our test network
	// if (network !== "test") {
	// The owner of the ProxyAdmin can upgrade our contracts
	await admin.transferProxyAdminOwnership(gnosisSafe);
	// }
};
