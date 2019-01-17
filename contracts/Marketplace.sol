pragma solidity ^0.5.0;

contract Marketplace {
  address private owner;
  address[] private admins;

  mapping (address => bool) public isAdmin;
  mapping (address => StoreOwner) public storeOwners;

  uint private storefrontsCount;
  mapping (uint => Storefront) private storefronts;

  struct StoreOwner {
      bool active;
      uint balance;
      uint[] storefrontsIds;
  }

  struct Storefront {
      uint id;
      string name;
      uint skuCount;
      address storeOwner;
      mapping (uint => Product) products;
  }

  struct Product {
      uint sku;
      string name;
      uint count;
      uint price;
  }

  constructor(address[] memory _admins) public {
      for (uint i = 0; i < _admins.length; i++) {
          isAdmin[_admins[i]] = true;
      }

      isAdmin[msg.sender] = true;
      owner = msg.sender;
      admins = _admins;
  }

  modifier onlyAdmin() {
      require(isAdmin[msg.sender]);
      _;
  }

  modifier onlyActiveOwner() {
      require(storeOwners[msg.sender].active);
      _;
  }

  function addStoreOwner(address storeOwner) public onlyAdmin {
      require(!storeOwners[storeOwner].active);

      storeOwners[storeOwner].active = true;
  }

  function addStorefront(string memory name) public onlyActiveOwner returns (uint) {
      storefrontsCount = storefrontsCount + 1;
      storeOwners[msg.sender].storefrontsIds.push(storefrontsCount);
      storefronts[storefrontsCount].id = storefrontsCount;
      storefronts[storefrontsCount].name = name;
      storefronts[storefrontsCount].storeOwner = msg.sender;

      return storefrontsCount;
  }

  function getStorefront(uint _id) public view onlyActiveOwner returns (uint id, string memory name, uint skuCount) {
      require(storefronts[_id].storeOwner == msg.sender);

      id = storefronts[_id].id;
      name = storefronts[_id].name;
      skuCount = storefronts[_id].skuCount;
  }

  function getStorefrontsIds() public view onlyActiveOwner returns (uint[] memory) {
      return storeOwners[msg.sender].storefrontsIds;
  }
}
