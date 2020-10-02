var StableCoinInterestRateModel = artifacts.require(
	"./StableCoinInterestRateModel.sol"
);

module.exports = async (deployer, network, accounts) => {
	if (network == "rinkeby") {
		await deployer.deploy(StableCoinInterestRateModel);
	}
	if (network == "kovan") {
		await deployer.deploy(StableCoinInterestRateModel);
	}
	if (network == "ropsten") {
		await deployer.deploy(StableCoinInterestRateModel);
	}
};