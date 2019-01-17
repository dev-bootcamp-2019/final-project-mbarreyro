const Marketplace = artifacts.require("./Marketplace.sol");

contract("Marketplace", accounts => {
  it("...admin account should be able to add store owner", async () => {
    const marketplaceInstance = await Marketplace.deployed();

    // Add store owner
    await marketplaceInstance.addStoreOwner(accounts[2], { from: accounts[0] });

    // Get store owner
    const storeOwner = await marketplaceInstance.storeOwners.call(accounts[2]);

    assert.equal(storeOwner.active, true, "Store owner should be active");
  });

  it("... not admin should not be able to add an store owner", async () => {
    const marketplaceInstance = await Marketplace.deployed();

    try {
      // Try to add store owner
      await marketplaceInstance.addStoreOwner(accounts[3], { from: accounts[3] });
    } catch(e) {
      // fail silently
    }

    // Get store owner
    const storeOwner = await marketplaceInstance.storeOwners.call(accounts[3]);

    assert.equal(storeOwner.active, false, "Store owner must not be active");
  });

  it("...active owner can add storefront", async () => {
    const marketplaceInstance = await Marketplace.deployed();

    // Add storefront
    await marketplaceInstance.addStorefront('My store 1', { from: accounts[2] });
    await marketplaceInstance.addStorefront('My store 2', { from: accounts[2] });

    // Get recently added storefront
    const storefront1 = await marketplaceInstance.getStorefront.call(1, { from: accounts[2] });
    const storefront2 = await marketplaceInstance.getStorefront.call(2, { from: accounts[2] });
    assert.equal(storefront1.id, 1, "Store 1 should have id = 1");
    assert.equal(storefront2.id, 2, "Store 2 should have id = 2");
  });

  it("...active owner cannot access another owners storefront", async () => {
    const marketplaceInstance = await Marketplace.deployed();

    // Add another store owner
    await marketplaceInstance.addStoreOwner(accounts[3], { from: accounts[0] });
    // Add storefront
    await marketplaceInstance.addStorefront('My store 3', { from: accounts[3] });

    // Get recently added storefront
    const storefront3 = await marketplaceInstance.getStorefront.call(3, { from: accounts[3] });

    assert.equal(storefront3.id, 3, "Store owner 3 should be able to access store 3");

    let storefront3by2;
    try {
        storefront3by2 = await marketplaceInstance.getStorefront.call(3, { from: accounts[2] });
    } catch (e) {
      // fail silently
    }

    assert.equal(storefront3by2, undefined, "Store front should be undefined");
  });
});
