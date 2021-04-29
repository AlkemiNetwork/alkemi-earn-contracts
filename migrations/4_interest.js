var StandardInterestRateModel = artifacts.require(
	"./StandardInterestRateModel.sol"
);

module.exports = async (deployer, network, accounts) => {
	if (network == "rinkeby" || network == "development") {
		await deployer.deploy(StandardInterestRateModel);
	}
	if (network == "kovan") {
		await deployer.deploy(StandardInterestRateModel);
	}
	if (network == "ropsten") {
		await deployer.deploy(StandardInterestRateModel);
	}
};
