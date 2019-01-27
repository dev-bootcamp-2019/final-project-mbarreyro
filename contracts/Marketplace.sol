pragma solidity ^0.5.0;

import "./Administrable.sol";
import "./EmergencyStoppable.sol";

/**
 * @title A Marketplace
 * @author Martin Ernesto Barreyro (barreyromartin@gmail.com)
 */
contract Marketplace is Administrable, EmergencyStoppable {
    mapping(address => bool) public storeOwners;
    mapping(address => uint[]) public ownerStorefrontIds;
    mapping(address => uint) private balances;

    struct Storefront {
        uint id;
        string name;
        address storeOwner;
        uint[] skus;
    }
    uint private storefrontsCount;
    mapping(uint => Storefront) private storefronts;

    struct Product {
        uint sku;
        string name;
        uint count;
        uint price;
        uint storefrontId;
        uint indexInStorefront;
    }
    uint private skuCount;
    mapping(uint => Product) private products;

    /**
     * Constructor of the contract
     * @param _admins addresses of the admins of the Marketplace contract
     */
    constructor(address[] memory _admins)
        Administrable(_admins)
        EmergencyStoppable(_admins)
        public
    {

    }

    modifier onlyActiveOwner() {
        require(storeOwners[msg.sender]);
        _;
    }

    /**
     * Adds a new storefront owner
     * @param storeOwner the address of the new store owner
     */
    function addStoreOwner(address storeOwner) external onlyAdmin {
        require(!storeOwners[storeOwner], "Owner already exists");

        storeOwners[storeOwner] = true;
    }

    /**
     * Adds a new storefront
     * @param name the name of the new storefront
     * @return the ID of the new storefront
     */
    function addStorefront(string calldata name)
        external
        onlyActiveOwner
        returns (uint)
    {
        require(
            storefrontsCount != ((2**256) - 1),
            "No more storefronts can be added"
        );

        storefrontsCount++;
        ownerStorefrontIds[msg.sender].push(storefrontsCount);
        storefronts[storefrontsCount].id = storefrontsCount;
        storefronts[storefrontsCount].name = name;
        storefronts[storefrontsCount].storeOwner = msg.sender;

        return storefrontsCount;
    }

    /**
     * Gets storefront ID, name and list of product SKUs
     * @param _id the ID of the storefront information to retrieve
     * @return ID, name and SKU array of the storefront
     */
    function getStorefront(uint _id)
        external
        view
        returns (uint id, string memory name, uint[] memory skus)
    {
        id = storefronts[_id].id;
        name = storefronts[_id].name;
        skus = storefronts[_id].skus;
    }

    /**
     * Gets the amount of storefronts owned by an store owner
     * @param storeOwner the address of the store owner count required
     * @return the amount of storefronts of the specified store owner
     */
    function getOwnerStorefrontCount(address storeOwner)
        external
        view
        returns (uint)
    {
        return ownerStorefrontIds[storeOwner].length;
    }

    /**
     * @return the total amount of all storefronts of all owners
     */
    function getStorefrontCount() external view returns (uint) {
        return storefrontsCount;
    }

    /**
     * Adds a new product to a storefront
     * @param _storefrontId the storefront where to add the product
     * @param name name of the new product
     * @param count amount of available products
     * @param price cost in Wei of the product
     * @return the ID of the new product
     */
    function addProduct(
        uint _storefrontId,
        string calldata name,
        uint count,
        uint price
    )
        external
        onlyActiveOwner
        returns (uint)
    {
        require(storefronts[_storefrontId].storeOwner == msg.sender);
        require(price > 0);
        require(
            skuCount != ((2**256) - 1),
            "No more products can be added"
        );

        skuCount++;

        products[skuCount].storefrontId = _storefrontId;
        products[skuCount].sku = skuCount;
        products[skuCount].name = name;
        products[skuCount].price = price;
        products[skuCount].count = count;
        products[skuCount].indexInStorefront = storefronts[_storefrontId].skus.push(skuCount) - 1;

        return skuCount;
    }

    /**
     * Gets the details of a product
     * @param _sku the SKU of the product required
     * @return SKU, name, price and storefront ID of the product
     */
    function getProduct(uint _sku)
        external
        view
        returns (
            uint sku,
            string memory name,
            uint price,
            uint count,
            uint storefrontId
        )
    {
        require(products[_sku].sku != 0, "Product does not exist");
        sku = products[_sku].sku;
        name = products[_sku].name;
        price = products[_sku].price;
        count = products[_sku].count;
        storefrontId = products[_sku].storefrontId;
    }

    /**
     * Deletes a product
     * @param _sku the SKU of the product to remove
     */
    function deleteProduct(uint _sku) external onlyActiveOwner {
        require(
            storefronts[products[_sku].storefrontId].storeOwner == msg.sender
        );

        // Storefront of the product to delete
        uint storefrontId = products[_sku].storefrontId;
        // Index of the product to delete in storefront's SKUs array
        uint index = products[_sku].indexInStorefront;
        // Length of the storefront's SKU array
        uint skusLength = storefronts[storefrontId].skus.length;

        require(skusLength > 0, "Storefront's SKU list is invalid");

        // For the array of SKUs in storefront we need to move the last element
        // of the array to the index of the product beign removed
        uint lastProductIndex;
        uint lastProductSku;
        if (skusLength > 1) {
            // Get the last product index
            lastProductIndex = storefronts[storefrontId].skus[skusLength - 1];
            // Copy it to the index of the product that is being removed
            // from the storefront
            storefronts[storefrontId].skus[index] = lastProductIndex;
            // Get the replacing product SKU
            lastProductSku = storefronts[storefrontId].skus[index];
            // Update products indexInStorefront to its new index in storefornt
            // SKUs array
            products[lastProductSku].indexInStorefront = index;
        }

        // Delete preduct from mapping
        delete products[_sku];
        // Remove last product index (already moved to its new place) by
        // decrementing storefront SKUs array length by one
        storefronts[storefrontId].skus.length--;
    }

    /**
     * Updates product price
     * @param _sku the SKU of the product to update
     * @param price the new price of the product
     */
    function updateProductPrice(uint _sku, uint price)
        external
        onlyActiveOwner
    {
        require(
            storefronts[products[_sku].storefrontId].storeOwner == msg.sender
        );

        products[_sku].price = price;
    }

    /**
     * Updates product count
     * @param _sku the SKU of the product to update
     * @param count the new count of the product
     */
    function updateProductCount(uint _sku, uint count)
        external
        onlyActiveOwner
    {
        require(
            storefronts[products[_sku].storefrontId].storeOwner == msg.sender
        );

        products[_sku].count = count;
    }

    /**
     * Buy a product, incremente store owner's balance by price and quantity,
     * decrement products count by quantity
     * @param _sku the SKU of the product being bought
     * @param quantity the desired amount of the product
     */
    function buyProduct(uint _sku, uint quantity)
        external
        payable
        stopInEmergency
    {
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

    /**
     * Get the balance of the sender (it has to be a store owner)
     * @return the balance of the sender
     */
    function balance() external view onlyActiveOwner returns(uint) {
        return balances[msg.sender];
    }

    /**
     * Withdraw an amount of ether from it's balance (it has to be a store owner)
     * @param amount the amount of ether in Wei to withdraw
     */
    function withdraw(uint amount) external onlyActiveOwner stopInEmergency {
        require(
            amount <= balances[msg.sender],
            "You dont have enough founds to perform this operation"
        );

        balances[msg.sender] -= amount;
        msg.sender.transfer(amount);
    }
}
