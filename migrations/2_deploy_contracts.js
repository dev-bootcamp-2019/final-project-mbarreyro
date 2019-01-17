var Marketplace = artifacts.require("./Marketplace.sol");

module.exports = function(deployer, network, accounts) {
  const admins = [accounts[0], accounts[1]];

  deployer.deploy(Marketplace, admins);
};
