const CarbonCreditToken = artifacts.require("CarbonCreditToken");
const ProjectRegistration = artifacts.require("ProjectRegistration");
const Governance = artifacts.require("Governance");

module.exports = function (deployer) {
  const initialSupply = web3.utils.toWei('1000000', 'ether'); // 1,000,000 CCT

  deployer.deploy(CarbonCreditToken, initialSupply).then(function () {
    return deployer.deploy(ProjectRegistration).then(function () {
      return deployer.deploy(Governance, CarbonCreditToken.address, ProjectRegistration.address);
    });
  });
};
