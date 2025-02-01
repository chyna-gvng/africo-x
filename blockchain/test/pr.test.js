const CarbonCreditToken = artifacts.require("CarbonCreditToken");
const ProjectRegistration = artifacts.require("ProjectRegistration");

contract("ProjectRegistration", (accounts) => {
  let cct, projectReg;
  const [admin, projectOwner, buyer1, buyer2, buyer3] = accounts;

  beforeEach(async () => {
    // Deploy contracts
    cct = await CarbonCreditToken.new();
    projectReg = await ProjectRegistration.new(cct.address);

    // Link contracts
    await cct.setProjectRegistration(projectReg.address);

    // Setup roles (automatically adds buyers to eligible voters)
    await cct.setRole(projectOwner, 2, { from: admin }); // Project Owner
    await cct.setRole(buyer1, 3, { from: admin }); // Buyer
    await cct.setRole(buyer2, 3, { from: admin }); // Buyer
    await cct.setRole(buyer3, 3, { from: admin }); // Buyer

    // Mint tokens (different amounts for different buyers)
    await cct.mint(buyer1, web3.utils.toWei("1000", "ether"), { from: admin });
    await cct.mint(buyer2, web3.utils.toWei("500", "ether"), { from: admin });
    await cct.mint(buyer3, web3.utils.toWei("2000", "ether"), { from: admin });
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

  it("should prevent non-buyers from voting", async () => {
    await projectReg.submitProject("Test Project", { from: projectOwner });

    try {
      await projectReg.voteForProject(0, { from: projectOwner });
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(error.message, "Not an eligible voter");
    }
  });

  it("should finalize project with sufficient votes", async () => {
    await projectReg.submitProject("Test Project", { from: projectOwner });
    const projectId = 0;

    // 🚀 **Ensure total votes exceed the 50% threshold**
    await projectReg.voteForProject(projectId, { from: buyer1 });
    await projectReg.voteForProject(projectId, { from: buyer3 }); // Extra voter ensures the project meets the requirement

    // Fetch vote weight details
    const totalEligibleVotes = web3.utils.toBN(await projectReg.getTotalEligibleVotes());
    const project = await projectReg.projects(projectId);
    const requiredVotes = totalEligibleVotes.div(web3.utils.toBN("2"));
    const projectVoteWeight = web3.utils.toBN(project.voteWeight);

    console.log(`🚀 DEBUG: Total Eligible Votes = ${totalEligibleVotes.toString()}`);
    console.log(`🚀 DEBUG: Project Vote Weight = ${projectVoteWeight.toString()}`);
    console.log(`🚀 DEBUG: Required Votes = ${requiredVotes.toString()}`);

    // 🚀 **Ensure the project's vote weight exceeds the required threshold**
    assert(
      projectVoteWeight.gt(requiredVotes),
      `Expected project vote weight ${projectVoteWeight} to be greater than required votes ${requiredVotes}`
    );

    // 🚀 **Now finalization should succeed**
    await projectReg.finalizeProject(projectId, { from: admin });

    const finalizedProject = await projectReg.projects(projectId);
    assert.equal(finalizedProject.registered, true, "Project should be registered");
  });

  it("should prevent finalizing project with insufficient votes", async () => {
    // ✅ **Submit a project**
    await projectReg.submitProject("Test Project", { from: projectOwner });
    const projectId = 0;

    // ✅ **Only buyer2 votes (insufficient vote weight)**
    await projectReg.voteForProject(projectId, { from: buyer2 });

    // ✅ **Fetch vote weight details**
    const totalEligibleVotes = web3.utils.toBN(await projectReg.getTotalEligibleVotes());
    const project = await projectReg.projects(projectId);
    const requiredVotes = totalEligibleVotes.div(web3.utils.toBN("2"));
    const projectVoteWeight = web3.utils.toBN(project.voteWeight);

    console.log(`🚀 DEBUG: Total Eligible Votes = ${totalEligibleVotes.toString()}`);
    console.log(`🚀 DEBUG: Project Vote Weight = ${projectVoteWeight.toString()}`);
    console.log(`🚀 DEBUG: Required Votes = ${requiredVotes.toString()}`);

    // ✅ **Ensure the project's vote weight is below the required threshold**
    assert(
      projectVoteWeight.lt(requiredVotes),
      `Expected project vote weight ${projectVoteWeight} to be less than required votes ${requiredVotes}`
    );

    // ✅ **Try finalizing the project & expect failure**
    try {
      await projectReg.finalizeProject(projectId, { from: admin });
      assert.fail("Expected finalization to fail");
    } catch (error) {
      assert.include(
        error.message.toLowerCase(),
        "revert",
        "Expected 'revert' error message"
      );
    }
  });

  it("should return correct total eligible votes", async () => {
    const totalVotes = await projectReg.getTotalEligibleVotes();
    const expectedTotalVotes = web3.utils.toBN(
      (await cct.balanceOf(buyer1)).toString()
    )
      .add(web3.utils.toBN((await cct.balanceOf(buyer2)).toString()))
      .add(web3.utils.toBN((await cct.balanceOf(buyer3)).toString()));

    assert.equal(totalVotes.toString(), expectedTotalVotes.toString());
  });

  it("should check voter eligibility correctly", async () => {
    const isBuyer1Eligible = await projectReg.isEligibleVoter(buyer1);
    const isBuyer2Eligible = await projectReg.isEligibleVoter(buyer2);
    const isNonBuyerEligible = await projectReg.isEligibleVoter(admin);

    assert.equal(isBuyer1Eligible, true);
    assert.equal(isBuyer2Eligible, true);
    assert.equal(isNonBuyerEligible, false);
  });

  it("should return correct number of eligible voters", async () => {
    const voterCount = await projectReg.getEligibleVoterCount();
    assert.equal(voterCount.toString(), "3");
  });
});
