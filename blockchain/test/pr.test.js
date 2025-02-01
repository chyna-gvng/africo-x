const CarbonCreditToken = artifacts.require("CarbonCreditToken");
const ProjectRegistration = artifacts.require("ProjectRegistration");

contract("ProjectRegistration", (accounts) => {
  let cct, projectReg;
  const [admin, projectOwner, buyer1, buyer2, buyer3] = accounts;

  beforeEach(async () => {
    cct = await CarbonCreditToken.new();
    projectReg = await ProjectRegistration.new(cct.address);

    // Setup roles
    await cct.setRole(projectOwner, 2, { from: admin });
    await cct.setRole(buyer1, 3, { from: admin });
    await cct.setRole(buyer2, 3, { from: admin });
    await cct.setRole(buyer3, 3, { from: admin });

    // Mint equal amounts of tokens to buyers
    const tokenAmount = web3.utils.toWei("500", "ether");
    await cct.mint(buyer1, tokenAmount, { from: admin });
    await cct.mint(buyer2, tokenAmount, { from: admin });
    await cct.mint(buyer3, tokenAmount, { from: admin });
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

  it("should prevent finalizing project with insufficient votes", async () => {
    await projectReg.submitProject("Test Project", { from: projectOwner });
    const projectId = 0;

    // Only one buyer votes
    await projectReg.voteForProject(projectId, { from: buyer1 });

    const totalVoteWeight = await projectReg.totalVoteWeight();
    const project = await projectReg.projects(projectId);
    const projectVoteWeight = project.voteWeight;

    console.log(`🚀 DEBUG: Total Vote Weight = ${totalVoteWeight.toString()}`);
    console.log(`🚀 DEBUG: Project Vote Weight = ${projectVoteWeight.toString()}`);

    // Verify total vote weight is 1500 tokens (3 * 500)
    assert.equal(
      totalVoteWeight.toString(), 
      web3.utils.toWei("1500", "ether"), 
      "Total vote weight should be 1500 tokens"
    );

    // Ensure vote weight is actually below 50% of total vote weight
    assert(
      web3.utils.toBN(projectVoteWeight).lt(web3.utils.toBN(totalVoteWeight).divn(2)),
      `Expected project vote weight ${projectVoteWeight} to be less than 50% of total vote weight ${totalVoteWeight}`
    );

    try {
      await projectReg.finalizeProject(projectId, { from: admin });
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(error.message.toLowerCase(), "not enough votes", "Expected transaction to revert with 'not enough votes'");
    }
  });

  it("should finalize project when more than 50% vote", async () => {
    await projectReg.submitProject("Test Project", { from: projectOwner });
    const projectId = 0;

    // Two buyers vote
    await projectReg.voteForProject(projectId, { from: buyer1 });
    await projectReg.voteForProject(projectId, { from: buyer2 });

    const totalVoteWeight = await projectReg.totalVoteWeight();
    const project = await projectReg.projects(projectId);
    const projectVoteWeight = project.voteWeight;

    console.log(`🚀 DEBUG: Total Vote Weight = ${totalVoteWeight.toString()}`);
    console.log(`🚀 DEBUG: Project Vote Weight = ${projectVoteWeight.toString()}`);

    // Verify total vote weight is 1500 tokens (3 * 500)
    assert.equal(
      totalVoteWeight.toString(), 
      web3.utils.toWei("1500", "ether"), 
      "Total vote weight should be 1500 tokens"
    );

    // Ensure vote weight is more than 50% of total vote weight
    assert(
      web3.utils.toBN(projectVoteWeight).gt(web3.utils.toBN(totalVoteWeight).divn(2)),
      `Expected project vote weight ${projectVoteWeight} to be more than 50% of total vote weight ${totalVoteWeight}`
    );

    await projectReg.finalizeProject(projectId, { from: admin });

    const updatedProject = await projectReg.projects(projectId);
    assert.equal(updatedProject.registered, true, "Project should be registered");
  });

  it("should prevent non-buyers from voting", async () => {
    await projectReg.submitProject("Test Project", { from: projectOwner });
    const projectId = 0;

    try {
      await projectReg.voteForProject(projectId, { from: projectOwner });
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(error.message, "Only buyers can vote");
    }
  });

  it("should prevent voting for invalid project", async () => {
    try {
      await projectReg.voteForProject(999, { from: buyer1 });
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(error.message, "Invalid project ID");
    }
  });
});
