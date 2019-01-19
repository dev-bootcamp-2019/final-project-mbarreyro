pragma solidity ^0.5.0;

contract Marketplace {
  address private owner;
  address[] private admins;

  mapping (address => bool) public isAdmin;
  mapping (address => bool) public storeOwners;
  mapping (address => uint[]) public ownerStorefrontIds;

  mapping (address => uint) private balances;

  uint private storefrontsCount;
  mapping (uint => Storefront) private storefronts;

  uint private skuCount;
  mapping (uint => Product) private products;

  struct Storefront {
      uint id;
      string name;
      address storeOwner;
      uint[] skus;
  }

  struct Product {
      uint sku;
      string name;
      uint count;
      uint price;
      uint storefrontId;
      uint indexInStorefront;
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
      require(storeOwners[msg.sender]);
      _;
  }

  function addStoreOwner(address storeOwner) public onlyAdmin {
      require(!storeOwners[storeOwner], 'Owner already exists');

      storeOwners[storeOwner] = true;
  }

  function addStorefront(string memory name) public onlyActiveOwner returns (uint) {
      storefrontsCount++;
      ownerStorefrontIds[msg.sender].push(storefrontsCount);
      storefronts[storefrontsCount].id = storefrontsCount;
      storefronts[storefrontsCount].name = name;
      storefronts[storefrontsCount].storeOwner = msg.sender;

      return storefrontsCount;
  }

  function getStorefront(uint _id) public view onlyActiveOwner returns (uint id, string memory name, uint[] memory skus) {
      require(storefronts[_id].storeOwner == msg.sender);

      id = storefronts[_id].id;
      name = storefronts[_id].name;
      skus = storefronts[_id].skus;
  }

  function getStorefrontCount(address storeOwner) public view returns (uint) {
      return ownerStorefrontIds[storeOwner].length;
  }

  function addProduct(uint _storefrontId, string memory name, uint count, uint price) public onlyActiveOwner returns (uint) {
      require(storefronts[_storefrontId].storeOwner == msg.sender);
      require(price > 0);

      skuCount++;

      products[skuCount].storefrontId = _storefrontId;
      products[skuCount].sku = skuCount;
      products[skuCount].name = name;
      products[skuCount].price = price;
      products[skuCount].count = count;
      products[skuCount].indexInStorefront = storefronts[_storefrontId].skus.push(skuCount) - 1;

      return skuCount;
  }

  function getProduct(uint _sku) public view onlyActiveOwner returns (uint sku, string memory name, uint price, uint count, uint storefrontId) {
      require(storefronts[products[_sku].storefrontId].storeOwner == msg.sender);

      sku = products[_sku].sku;
      name = products[_sku].name;
      price = products[_sku].price;
      count = products[_sku].count;
      storefrontId = products[_sku].storefrontId;
  }

  function deleteProduct(uint _sku) public onlyActiveOwner {
      require(storefronts[products[_sku].storefrontId].storeOwner == msg.sender);

      uint storefrontId = products[_sku].storefrontId;
      uint index = products[_sku].indexInStorefront;
      uint skusLength = storefronts[storefrontId].skus.length;

      require(skusLength > 0);

      if (skusLength > 1) {
          // Replace
          storefronts[storefrontId].skus[index] = storefronts[storefrontId].skus[skusLength - 1];
          products[storefronts[storefrontId].skus[index]].indexInStorefront = index;
      }

      delete products[_sku];
      storefronts[storefrontId].skus.length--;
  }

  function buyProduct(uint _sku, uint quantity) public payable {
      require(quantity > 0);
      require(products[_sku].count >= quantity);
      require(products[_sku].price * quantity <= msg.value);

      Product memory product = products[_sku];
      Storefront memory storefront = storefronts[product.storefrontId];

      balances[storefront.storeOwner] += products[_sku].price * quantity;
      products[_sku].count -= quantity;

      uint toRefund = msg.value - products[_sku].price * quantity;
      if (toRefund > 0) {
        msg.sender.transfer(toRefund);
      }
  }

  function balance() public view onlyActiveOwner returns(uint) {
      return balances[msg.sender];
  }

  function withdraw() public onlyActiveOwner {
      uint amount = balances[msg.sender];

      balances[msg.sender] = 0;
      msg.sender.transfer(amount);
  }
}
