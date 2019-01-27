var Marketplace = artifacts.require("./Marketplace.sol");
var Administrable = artifacts.require("./Administrable.sol");
var EmergencyStoppable = artifacts.require("./EmergencyStoppable.sol");

module.exports = function(deployer, network, accounts) {
  const admins = [accounts[0]];

  deployer.deploy(Marketplace, admins);
  deployer.deploy(Administrable, admins);
  deployer.deploy(EmergencyStoppable, admins);
};
