// migrations/3_transfer_ownership.js
const { admin } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer, network) {
	// Use address of your Gnosis Safe
	const gnosisSafe = "0xc85ef6C29fFA2F9FC5504433a350103e6237ADb2";

	// Don't change ProxyAdmin ownership for our test network
	// if (network !== "test") {
	// The owner of the ProxyAdmin can upgrade our contracts
	await admin.transferProxyAdminOwnership(gnosisSafe);
	// }
};
