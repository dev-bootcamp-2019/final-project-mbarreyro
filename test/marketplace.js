const Marketplace = artifacts.require("./Marketplace.sol");

contract("Marketplace", accounts => {
  const admin = accounts[0];
  const storeOwner1 = accounts[2];
  const storeOwner2 = accounts[3];
  const externalUser = accounts[4];
  const storefront1Id = 1;
  const storefront2Id = 2;

  const freezerId = 1;
  const freezerPrice = web3.utils.toWei('2', 'ether');
  const microwaveId = 2;
  const microwavePrice = web3.utils.toWei('1.5', 'ether');

  it("...admin account should be able to add store owner", async () => {
    /*
      Tests that an admin should be able to add store owners
    */
    const marketplaceInstance = await Marketplace.deployed();

    // Check store owners are not active yet
    const storeOwner1Inactive = await marketplaceInstance.storeOwners.call(storeOwner1);
    const storeOwner2Inactive = await marketplaceInstance.storeOwners.call(storeOwner2);
    assert.equal(storeOwner1Inactive, false, "Store owner 1 should be inactive before add call");
    assert.equal(storeOwner2Inactive, false, "Store owner 2 should be inactive before add call");

    // Add store owners
    await marketplaceInstance.addStoreOwner(storeOwner1, { from: admin });
    await marketplaceInstance.addStoreOwner(storeOwner2, { from: admin });

    // Check store owners are now active
    const storeOwner1Aactive = await marketplaceInstance.storeOwners.call(storeOwner1);
    const storeOwner2Active = await marketplaceInstance.storeOwners.call(storeOwner2);
    assert.equal(storeOwner1Aactive, true, "Store owner 1 should be active after add call");
    assert.equal(storeOwner2Active, true, "Store owner 2 should be active after add call");
  });

  it("...not admin account should not be able to add an store owner", async () => {
    /*
      An external user attemps to add himself as an store owner
    */
    let failed = false;

    const marketplaceInstance = await Marketplace.deployed();

    try {
      // Exteral user calls add store owner with himself as parameter
      await marketplaceInstance.addStoreOwner(externalUser, { from: externalUser });
    } catch(e) {
      failed = true;
    }

    // Get store owner
    const storeOwnerActive = await marketplaceInstance.storeOwners.call(externalUser);

    assert.equal(storeOwnerActive, false, "External user shound not be active as store owner");
    assert.equal(failed, true, "Add store owner call should have raised an error");
  });

  it("...active owner can add storefronts", async () => {
    /*
      An active store owner adds storefronts
    */
    const marketplaceInstance = await Marketplace.deployed();

    // Add storefronts
    await marketplaceInstance.addStorefront('My store 1', { from: storeOwner1 });
    await marketplaceInstance.addStorefront('My store 2', { from: storeOwner1 });

    // Get recently added storefronts
    const storefront1 = await marketplaceInstance.getStorefront.call(storefront1Id, { from: storeOwner1 });
    const storefront2 = await marketplaceInstance.getStorefront.call(storefront2Id, { from: storeOwner1 });
    const id0 = await marketplaceInstance.ownerStorefrontIds.call(storeOwner1, 0, { from: storeOwner1 });
    const id1 = await marketplaceInstance.ownerStorefrontIds.call(storeOwner1, 1, { from: storeOwner1 });
    const len = await marketplaceInstance.getOwnerStorefrontCount.call(storeOwner1);

    assert.equal(storefront1.id, storefront1Id, "Store 1 should have id = 1");
    assert.equal(storefront1.name, 'My store 1', "Store 1 be named My store 1");
    assert.equal(storefront2.id, storefront2Id, "Store 2 should have id = 2");
    assert.equal(storefront2.name, 'My store 2', "Store 2 be named My store 2");
    assert.equal(id0, storefront1Id, "Ids returned index 0 should be 1");
    assert.equal(id1, storefront2Id, "Ids returned index 1 should be 2");
    assert.equal(len, 2, "Store owner should have 2 storefront ids");
  });

  it("...active owner can add new product to storefront", async () => {
    /*
     * One of the active store owners adds two new products. A Freezer and a Microwave
     *
     */
    const marketplaceInstance = await Marketplace.deployed();

    // Adds products
    await marketplaceInstance.addProduct(storefront1Id, 'Freezer', 10, freezerPrice, { from: storeOwner1 });
    await marketplaceInstance.addProduct(storefront1Id, 'Microwave', 15, microwavePrice, { from: storeOwner1 });

    // Get products and storefront information
    const freezer = await marketplaceInstance.getProduct.call(freezerId, { from: storeOwner1 });
    const microwave = await marketplaceInstance.getProduct.call(microwaveId, { from: storeOwner1 });

    const storefront = await marketplaceInstance.getStorefront.call(storefront1Id, { from: storeOwner1 });

    assert.equal(freezer.sku, freezerId, 'Freezer sku should be 1');
    assert.equal(freezer.name, 'Freezer', 'First product name should be Freezer');
    assert.equal(microwave.sku, microwaveId, 'Microwave sku should be 2');
    assert.equal(microwave.name, 'Microwave', 'Second product name should be Microwave');
    assert.equal(storefront.skus.length, 2, 'Storefront should have two products');
  });

  it("...active store owner can not modify a product from another storefront owner", async () => {
    /*
     * An existing and active owner attemps to modify a product from another storefront owner
     *
     */
    const marketplaceInstance = await Marketplace.deployed();
    let failed = false;

    try {
        await marketplaceInstance.updateProductPrice(freezerId, 23232, { from: storeOwner2 });
    } catch (e) {
      failed = true;
    }

    assert.equal(failed, true, "trying to update a product from a different account than store owner should fail");
  });

  it("...active store owner can remove an existing product from storefront", async () => {
    /*
     * Store owner deletes a product, storefront products count is reduced by 1
     * An attempt to retrieve product fails
     */
    const marketplaceInstance = await Marketplace.deployed();

    // Check product exists
    const microwaveExists = await marketplaceInstance.getProduct(microwaveId);
    assert.equal(microwaveExists.sku, microwaveId, 'Microwave should exist');

    // Delete product
    await marketplaceInstance.deleteProduct(microwaveId, { from: storeOwner1 });

    // Check does note exist. Get product fails
    let failed = false;
    try {
        const microwaveFails = await marketplaceInstance.getProduct(microwaveId);
    } catch (e) {
      failed = true;
    }
    assert.equal(failed, true, 'Get Microwave fails after delete');

    // Check storefront SKUs amount is now 1
    const storefrontAfterDelete = await marketplaceInstance.getStorefront.call(storefront1Id, { from: storeOwner1 });
    assert.equal(storefrontAfterDelete.skus.length, 1, 'Storefront should have one product');
  });

  it("...an external user buys a product", async () => {
    /*
     * An external user buys a Freezer. We check account balance before and after
     */
    const marketplaceInstance = await Marketplace.deployed();

    // Get gas price for balance calculations
    const gasPrice = await web3.eth.getGasPrice();

    let balanceBefore = await web3.eth.getBalance(externalUser);
    let tx = await marketplaceInstance.buyProduct(freezerId, 1, {from: externalUser, value: freezerPrice});
    let balanceAfter = await web3.eth.getBalance(externalUser);

    const txCost = parseInt(tx.receipt.gasUsed, 10) * parseInt(gasPrice, 10);

    // Calculate the amount of ether used for this Tx
    const usedEther = parseInt(freezerPrice, 10) + txCost;

    // We approximate after account balance because calculation is not always exact
    const diff = Math.abs((parseInt(balanceBefore, 10) - parseInt(usedEther, 10)) - parseInt(balanceAfter, 10));
    assert.isBelow(diff, 20000, "Balance after should be before less price and tx cost");

    // Store owner internal balance is incremented by product price
    let balance = await marketplaceInstance.balance.call({from: storeOwner1});
    assert.equal(parseInt(balance, 10), parseInt(freezerPrice, 10), 'balance should be equal to price * quantity');
  });

  it("...an store owner should be able to withdraw founds", async () => {
    /*
     * A Store Owner withdraws an amount of ether from his internal balance
     */
    const marketplaceInstance = await Marketplace.deployed();
    const amountToWithdraw = web3.utils.toWei('1', 'ether');
    // Get gas price for balance calculations
    const gasPrice = await web3.eth.getGasPrice();

    // Get balance after, withdraw and check the difference is equal to withdrawed amount
    let internalBalanceBefore = await marketplaceInstance.balance.call({from: storeOwner1});
    let balanceBefore = await web3.eth.getBalance(storeOwner1);

    let tx = await marketplaceInstance.withdraw(amountToWithdraw, {from: storeOwner1});

    let internalBalanceAfter = await marketplaceInstance.balance.call({from: storeOwner1});
    let balanceAfter = await web3.eth.getBalance(storeOwner1);

    const txCost = parseInt(tx.receipt.gasUsed, 10) * parseInt(gasPrice, 10);
    const withdrwedEther = parseInt(amountToWithdraw, 10) - txCost;

    assert.equal(parseInt(internalBalanceBefore, 10) - parseInt(internalBalanceAfter, 10), parseInt(amountToWithdraw, 10), 'balance after should be before less price * quantity');

    // We approximate after account balance because calculation is not always exact
    const diff = Math.abs(parseInt(balanceAfter, 10) - (parseInt(balanceBefore, 10) + parseInt(withdrwedEther, 10)));
    assert.isBelow(diff, 20000, "Balance after should be before plus withdraw amount less Tx cost");
  });
});
