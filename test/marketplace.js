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

  it("...not admin should not be able to add an store owner", async () => {
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
    const ids = await marketplaceInstance.getStorefrontsIds.call({ from: accounts[2] });

    assert.equal(storefront1.id, 1, "Store 1 should have id = 1");
    assert.equal(storefront1.name, 'My store 1', "Store 1 be named My store 1");
    assert.equal(storefront2.id, 2, "Store 2 should have id = 2");
    assert.equal(storefront2.name, 'My store 2', "Store 2 be named My store 2");
    assert.equal(ids[0], 1, "Ids returned index 0 should be 1");
    assert.equal(ids[1], 2, "Ids returned index 1 should be 2");
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
    let failed = false;
    try {
        storefront3by2 = await marketplaceInstance.getStorefront.call(3, { from: accounts[2] });
    } catch (e) {
      failed = true;
    }

    assert.equal(storefront3by2, undefined, "Store front should be undefined");
    assert.equal(failed, true, "Call should fail");
  });

  it("...active owner can add new product to storefront", async () => {
    const marketplaceInstance = await Marketplace.deployed();

    await marketplaceInstance.addProduct(3, 'Cuchillo', 10, 100, { from: accounts[3] });

    const product = await marketplaceInstance.getProduct.call(1, { from: accounts[3] });
    const storefront = await marketplaceInstance.getStorefront.call(3, { from: accounts[3] });

    assert.equal(product.sku, 1, 'First product sku should be 1');
    assert.equal(product.name, 'Cuchillo', 'First product name should be Cuchillo');
    assert.equal(storefront.skus.length, 1, 'Storefront should have one product');
  });

  it("...active owner can add and remove new product to storefront", async () => {
    const marketplaceInstance = await Marketplace.deployed();

    await marketplaceInstance.addProduct(3, 'Plato', 15, 105, { from: accounts[3] });

    const product = await marketplaceInstance.getProduct.call(2, { from: accounts[3] });
    const storefront = await marketplaceInstance.getStorefront.call(3, { from: accounts[3] });

    assert.equal(product.sku, 2, 'First product sku should be 1');
    assert.equal(product.name, 'Plato', 'Second product name should be Plato');
    assert.equal(storefront.skus.length, 2, 'Storefront should have two products');

    await marketplaceInstance.deleteProduct(2, { from: accounts[3] });
    //
    const storefrontAfterDelete = await marketplaceInstance.getStorefront.call(3, { from: accounts[3] });
    assert.equal(storefrontAfterDelete.skus.length, 1, 'Storefront should have one product');
  });
});
