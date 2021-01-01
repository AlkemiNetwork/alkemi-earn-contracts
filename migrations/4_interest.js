var StandardInterestRateModel = artifacts.require(
  "./StandardInterestRateModel.sol"
);

module.exports = async (deployer, network, accounts) => {
  if (network == "rinkeby") {
    await deployer.deploy(StandardInterestRateModel);
  }
  if (network == "kovan") {
    await deployer.deploy(StandardInterestRateModel);
  }
  if (network == "ropsten") {
    await deployer.deploy(StandardInterestRateModel);
  }
  if (network == "test") {
    await deployer.deploy(StandardInterestRateModel);
  }
};
