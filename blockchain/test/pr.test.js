const CarbonCreditToken = artifacts.require("CarbonCreditToken");
const ProjectRegistration = artifacts.require("ProjectRegistration");

contract("ProjectRegistration", (accounts) => {
  let cct, projectReg;
  const [admin, projectOwner, buyer1, buyer2] = accounts;

  beforeEach(async () => {
    cct = await CarbonCreditToken.new();
    projectReg = await ProjectRegistration.new(cct.address);

    // Setup roles
    await cct.setRole(projectOwner, 2, { from: admin });
    await cct.setRole(buyer1, 3, { from: admin });
    await cct.setRole(buyer2, 3, { from: admin });

    // Mint initial tokens to buyers
    await cct.mint(buyer1, web3.utils.toWei("1000", "ether"), { from: admin });
    await cct.mint(buyer2, web3.utils.toWei("500", "ether"), { from: admin });
  });

  it("should allow project owners to submit projects", async () => {
    const projectName = "Green Forest";
    await projectReg.submitProject(projectName, { from: projectOwner });

    const project = await projectReg.projects(0);
    assert.equal(project.name, projectName);
    assert.equal(project.owner, projectOwner);
  });

  it("should prevent non-project owners from submitting projects", async () => {
    try {
      await projectReg.submitProject("Invalid Project", { from: buyer1 });
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(error.message, "Only project owners can submit projects");
    }
  });

  it("should allow buyers to vote for a project", async () => {
    await projectReg.submitProject("Test Project", { from: projectOwner });

    const projectId = 0;
    await projectReg.voteForProject(projectId, { from: buyer1 });

    const project = await projectReg.projects(projectId);
    const buyer1Balance = await cct.balanceOf(buyer1);
    assert.equal(project.voteWeight.toString(), buyer1Balance.toString());
  });

  it("should prevent double voting", async () => {
    await projectReg.submitProject("Test Project", { from: projectOwner });
    await projectReg.voteForProject(0, { from: buyer1 });

    try {
      await projectReg.voteForProject(0, { from: buyer1 });
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(error.message, "Already voted");
    }
  });

  it("should finalize project with sufficient votes", async () => {
    await projectReg.submitProject("Test Project", { from: projectOwner });
    const projectId = 0;

    await projectReg.voteForProject(projectId, { from: buyer1 });
    await projectReg.voteForProject(projectId, { from: buyer2 });

    await projectReg.finalizeProject(projectId, { from: admin });

    const project = await projectReg.projects(projectId);
    assert.equal(project.registered, true);
  });

  it("should prevent finalizing project with insufficient votes", async () => {
    await projectReg.submitProject("Test Project", { from: projectOwner });
    const projectId = 0;

    // 🚀 **Fix: Only one buyer votes, ensuring weight remains below 50%**
    await projectReg.voteForProject(projectId, { from: buyer2 });

    // 🚀 **Fix: Fetch updated vote weights AFTER voting**
    const totalVoteWeight = BigInt(await projectReg.totalVoteWeight());
    const project = await projectReg.projects(projectId);
    const projectVoteWeight = BigInt(project.voteWeight);

    console.log(`🚀 DEBUG: Total Vote Weight = ${totalVoteWeight.toString()}`);
    console.log(`🚀 DEBUG: Project Vote Weight = ${projectVoteWeight.toString()}`);

    // 🚀 **Fix: Ensure vote weight is actually below 50%**
    assert(
      projectVoteWeight < totalVoteWeight / BigInt(2),
      `Expected project vote weight ${projectVoteWeight} to be less than 50% of total vote weight ${totalVoteWeight}`
    );

    try {
      await projectReg.finalizeProject(projectId, { from: admin });
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(error.message.toLowerCase(), "revert", "Expected transaction to revert");
    }
  });
});
