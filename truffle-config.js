/**
 * remove comments for public chain migration
 */
const HDWalletProvider = require("truffle-hdwallet-provider");
const fs = require("fs");
const mnemonic = fs.readFileSync(".mnemonic").toString().trim();
const infuraKey = "c92203bc3a4544f28dae1f94627e5367";

module.exports = {
	networks: {
		development: {
			// provider: () =>
			// 	new HDWalletProvider(
			// 		"stand boy digital govern play draft hard garage remove neglect become slight",
			// 		`http://127.0.0.1:7545`
			// 	),
			host: "127.0.0.1", // Localhost (default: none)
			port: 8545, // Standard Ethereum port (default: none)
			network_id: "*", // Any network (default: none)
		},
		ganacheUI: {
			host: "127.0.0.1", // Localhost (default: none)
			port: 7545, // Standard Ethereum port (default: none)
			network_id: "*", // Any network (default: none)
		},
		coverage: {
			host: "localhost",
			network_id: "*",
			port: 8555, // <-- If you change this, also set the port option in .solcover.js.
			gas: 0xfffffffffff, // <-- Use this high gas value
			gasPrice: 0x01, // <-- Use this low gas price
		},
		rinkeby: {
			provider: () =>
				new HDWalletProvider(
					mnemonic,
					`https://rinkeby.infura.io/v3/${infuraKey}`
				),
			network_id: 4,
			skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
		},
		kovan: {
			provider: () =>
				new HDWalletProvider(
					mnemonic,
					`https://kovan.infura.io/v3/${infuraKey}`
				),
			gasPrice: 170000000000,
			network_id: 42,
			skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
		},
		ropsten: {
			provider: () =>
				new HDWalletProvider(
					mnemonic,
					`https://ropsten.infura.io/v3/${infuraKey}`
				),
			network_id: 3,
			skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
		},
		mainnet: {
			provider: () =>
				new HDWalletProvider(
					mnemonic,
					`https://mainnet.infura.io/v3/${infuraKey}`
				),
			gasPrice: 100000000000,
			timeoutBlocks: 4000,
			network_id: 1,
			skipDryRun: false, // Skip dry run before migrations? (default: false for public nets )
		},
	},

	// Set default mocha options here, use special reporters etc.
	mocha: {
		enableTimeouts: false,
		before_timeout: 0,
		test_timeout: 0,
	},

	compilers: {
		solc: {
			version: "0.4.24", // Fetch exact version from solc-bin (default: truffle's version)
			settings: {
				// See the solidity docs for advice about optimization and evmVersion
				optimizer: {
					enabled: true,
					runs: 200,
				},
			},
		},
	},
};
