const CarbonCreditToken = artifacts.require("CarbonCreditToken");
const ProjectRegistration = artifacts.require("ProjectRegistration");

module.exports = async function (deployer) {
  await deployer.deploy(CarbonCreditToken);
  const cct = await CarbonCreditToken.deployed();

  await deployer.deploy(ProjectRegistration, cct.address);
};
