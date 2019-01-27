const Administrable = artifacts.require("./Administrable.sol");

contract("Administrable", accounts => {
  const admin1 = accounts[0];
  const externalUser = accounts[6];


  it("...allows to check valid admins", async () => {
    /*
     * Check that first account (owner who has deployed the contract)
     * is an admin. Other external account should not be considered an admin
     */
    const administrableInstance = await Administrable.deployed();

    const isAdmin = await administrableInstance.isAdmin.call(admin1);
    const isNotAdmin = await administrableInstance.isAdmin.call(externalUser);

    assert.isTrue(isAdmin, 'first account should be admin');
    assert.isFalse(isNotAdmin, 'external user should not be admin');
  });
});
