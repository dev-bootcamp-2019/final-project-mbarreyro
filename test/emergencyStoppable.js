const EmergencyStoppable = artifacts.require("./EmergencyStoppable.sol");

contract("EmergencyStoppable", accounts => {
  const admin1 = accounts[0];
  const externalUser = accounts[6];

  it("...can only be stopped by admins and NOT by external users", async () => {
    /*
     * Try to stop the contract with an admin account and an external account
     */
    const emergencyStoppableInstance = await EmergencyStoppable.deployed();
    let failed = false;

    try {
      // Since the account is from an admin this action should be successful
      await emergencyStoppableInstance.stop.call({ from: admin1 });
    } catch (e) {
      // this should never happen
      failed = true;
    }

    assert.isFalse(failed, 'Stop call from an admin should not fail');

    try {
      // Since call is made with an external account this should fail
      await emergencyStoppableInstance.stop.call({ from: externalUser });
    } catch (e) {
      // this should always happen
      failed = true;
    }

    assert.isTrue(failed, 'Stop call from an external user should fail');
  });

  it("...can only be started by admins and NOT by external users", async () => {
    /*
     * Try to start the contract with an admin account and an external account
     */
    const emergencyStoppableInstance = await EmergencyStoppable.deployed();
    let failed = false;

    try {
      // Since the account is from an admin this action should be successful
      await emergencyStoppableInstance.start.call({ from: admin1 });
    } catch (e) {
      // this should never happen
      failed = true;
    }

    assert.isFalse(failed, 'Start call from an admin should not fail');

    try {
      // Since call is made with an external account this should fail
      await emergencyStoppableInstance.start.call({ from: externalUser });
    } catch (e) {
      // this should always happen
      failed = true;
    }

    assert.isTrue(failed, 'Start call from an external user should fail');
  });
});
