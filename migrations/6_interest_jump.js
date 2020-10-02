var JumpRateModel = artifacts.require("./JumpRateModel.sol");
var JumpRateModelV2 = artifacts.require("./JumpRateModelV2.sol");

module.exports = async (deployer, network, accounts) => {
	if (network == "rinkeby") {
		await deployer.deploy(JumpRateModel);
		await deployer.deploy(JumpRateModelV2);
	}
	if (network == "kovan") {
		await deployer.deploy(JumpRateModel);
		await deployer.deploy(JumpRateModelV2);
	}
	if (network == "ropsten") {
		await deployer.deploy(JumpRateModel);
		await deployer.deploy(JumpRateModelV2);
	}
};
