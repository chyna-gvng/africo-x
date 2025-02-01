const CarbonCreditToken = artifacts.require("CarbonCreditToken");

contract("CarbonCreditToken", (accounts) => {
  let cct;
  const [admin, projectOwner1, buyer1, buyer2] = accounts;

  beforeEach(async () => {
    cct = await CarbonCreditToken.new();
  });

  it("should assign the deployer as the Admin", async () => {
    const role = await cct.roles(admin);
    assert.equal(role.toString(), "1"); // Role.Admin = 1
  });

  it("should allow admin to set roles", async () => {
    await cct.setRole(projectOwner1, 2);
    await cct.setRole(buyer1, 3);

    const projectOwnerRole = await cct.roles(projectOwner1);
    const buyerRole = await cct.roles(buyer1);

    assert.equal(projectOwnerRole.toString(), "2");
    assert.equal(buyerRole.toString(), "3");
  });

  it("should only allow owner to set roles", async () => {
    try {
      await cct.setRole(buyer2, 2, { from: buyer1 });
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(error.message.toLowerCase(), "revert", "Expected transaction to revert");
    }
  });

  it("should allow admin to mint tokens", async () => {
    const amount = web3.utils.toWei("100", "ether");
    await cct.mint(buyer1, amount, { from: admin });

    const balance = await cct.balanceOf(buyer1);
    assert.equal(balance.toString(), amount);
  });

  it("should only allow owner to mint tokens", async () => {
    const amount = web3.utils.toWei("100", "ether");
    try {
      await cct.mint(buyer1, amount, { from: buyer2 });
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(error.message.toLowerCase(), "revert", "Expected transaction to revert");
    }
  });

  it("should allow users to burn their tokens", async () => {
    const mintAmount = web3.utils.toWei("1000", "ether");
    const burnAmount = web3.utils.toWei("100", "ether");

    await cct.mint(buyer1, mintAmount, { from: admin });
    await cct.burn(burnAmount, { from: buyer1 });

    const finalBalance = await cct.balanceOf(buyer1);
    assert.equal(
      finalBalance.toString(),
      web3.utils.toBN(mintAmount).sub(web3.utils.toBN(burnAmount)).toString()
    );
  });

  it("should allow admin to set depletion rate", async () => {
    const rate = web3.utils.toWei("10", "ether");
    await cct.setDepletionRate(buyer1, rate, { from: admin });

    const storedRate = await cct.depletionRate(buyer1);
    assert.equal(storedRate.toString(), rate);
  });
});
