const Marketplace = artifacts.require("./Marketplace.sol");

contract("Marketplace", accounts => {
  it("...admin account should be able to add store owner", async () => {
    const marketplaceInstance = await Marketplace.deployed();

    // Add store owner
    await marketplaceInstance.addStoreOwner(accounts[2], { from: accounts[0] });

    // Get store owner
    const storeOwnerActive = await marketplaceInstance.storeOwners.call(accounts[2]);

    assert.equal(storeOwnerActive, true, "Store owner should be active");
  });

  it("...not admin should not be able to add an store owner", async () => {
    const marketplaceInstance = await Marketplace.deployed();
    let failed = false;

    try {
      // Try to add store owner
      await marketplaceInstance.addStoreOwner(accounts[3], { from: accounts[3] });
    } catch(e) {
      failed = true;
    }

    // Get store owner
    const storeOwnerActive = await marketplaceInstance.storeOwners.call(accounts[3]);

    assert.equal(storeOwnerActive, false, "Store owner must not be active");
    assert.equal(failed, true, "Store owner must not be active");
  });

  it("...active owner can add storefront", async () => {
    const marketplaceInstance = await Marketplace.deployed();

    // Add storefront
    await marketplaceInstance.addStorefront('My store 1', { from: accounts[2] });
    await marketplaceInstance.addStorefront('My store 2', { from: accounts[2] });

    // Get recently added storefront
    const storefront1 = await marketplaceInstance.getStorefront.call(1, { from: accounts[2] });
    const storefront2 = await marketplaceInstance.getStorefront.call(2, { from: accounts[2] });
    const id0 = await marketplaceInstance.ownerStorefrontIds.call(accounts[2], 0, { from: accounts[2] });
    const id1 = await marketplaceInstance.ownerStorefrontIds.call(accounts[2], 1, { from: accounts[2] });
    const len = await marketplaceInstance.getOwnerStorefrontCount.call(accounts[2]);

    assert.equal(storefront1.id, 1, "Store 1 should have id = 1");
    assert.equal(storefront1.name, 'My store 1', "Store 1 be named My store 1");
    assert.equal(storefront2.id, 2, "Store 2 should have id = 2");
    assert.equal(storefront2.name, 'My store 2', "Store 2 be named My store 2");
    assert.equal(id0, 1, "Ids returned index 0 should be 1");
    assert.equal(id1, 2, "Ids returned index 1 should be 2");
    assert.equal(len, 2, "Store owner should have 2 storefront ids");
  });

  it("...active owner can add new product to storefront", async () => {
    const marketplaceInstance = await Marketplace.deployed();

    await marketplaceInstance.addProduct(2, 'Cuchillo', 10, 1000000, { from: accounts[2] });

    const product = await marketplaceInstance.getProduct.call(1, { from: accounts[2] });
    const storefront = await marketplaceInstance.getStorefront.call(2, { from: accounts[2] });

    assert.equal(product.sku, 1, 'First product sku should be 1');
    assert.equal(product.name, 'Cuchillo', 'First product name should be Cuchillo');
    assert.equal(storefront.skus.length, 1, 'Storefront should have one product');
  });

  it("...active owner can add and remove new product to storefront", async () => {
    const marketplaceInstance = await Marketplace.deployed();

    await marketplaceInstance.addProduct(2, 'Plato', 15, 105, { from: accounts[2] });

    const product = await marketplaceInstance.getProduct.call(2, { from: accounts[2] });
    const storefront = await marketplaceInstance.getStorefront.call(2, { from: accounts[2] });

    assert.equal(product.sku, 2, 'First product sku should be 1');
    assert.equal(product.name, 'Plato', 'Second product name should be Plato');
    assert.equal(storefront.skus.length, 2, 'Storefront should have two products');

    await marketplaceInstance.deleteProduct(2, { from: accounts[2] });
    //
    const storefrontAfterDelete = await marketplaceInstance.getStorefront.call(2, { from: accounts[2] });
    assert.equal(storefrontAfterDelete.skus.length, 1, 'Storefront should have one product');
  });

  it("...an external user buys a product", async () => {
    const marketplaceInstance = await Marketplace.deployed();

    let balanceBefore = await web3.eth.getBalance(accounts[4]);
    let tx = await marketplaceInstance.buyProduct(1, 3, {from: accounts[4], value: 4000000});
    let balanceAfter = await web3.eth.getBalance(accounts[4]);

    assert.isBelow(parseInt(balanceAfter, 10), parseInt(balanceBefore, 10) - parseInt(3000000, 10), "Balance after should be before less price");

    let balance = await marketplaceInstance.balance.call({from: accounts[2]});
    assert.equal(parseInt(balance, 10), 3000000, 'balance should be equal to price * quantity');
  });

  it("...an store owner should be able to withdraw founds", async () => {
    const marketplaceInstance = await Marketplace.deployed();

    let balanceBefore = await marketplaceInstance.balance.call({from: accounts[2]});
    let tx = await marketplaceInstance.withdraw(3000000, {from: accounts[2]});
    let balanceAfter = await marketplaceInstance.balance.call({from: accounts[2]});

    assert.equal(parseInt(balanceBefore, 10) - 3000000, parseInt(balanceAfter, 10), 'balance after should be before less price * quantity');
  });
});
