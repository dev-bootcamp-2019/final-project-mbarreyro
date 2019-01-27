# Design pattern desicions

## Common patterns used

See: https://solidity.readthedocs.io/en/v0.5.3/common-patterns.html

### Withdrawal from Contracts

The implementation of this pattern comes from Marketplace final project requirements. It's useful to avoid Reentrancy attacks.

### Restricting Access

Created an Administrable contract that keeps a collection of administrator accounts. The owner of the contract (the account that deployed it) is also automatically set as an admin. This contract comes with modifiers `onlyOwner` and `onlyAdmin` to restrict execution in functions that use them.

I created this separately to have an example of extension of a contract and I think is a useful contract to reuse when more than one admin account. For example a contract is deployed by one account but it will be managed from other specific accounts.

## Circuit breaker

Added a contract called `EmergencyStoppable`. Constructor receives a list of accounts that are allowed to stop/start functions marked with modifiers. Owner (the account that deployed) the contract is automatically set as one of the allowed accounts to change the state of the circuit breaker.

I made this separately to show another example of extending contracts.

This contract could have extended Administrable contract from before but I wanted to keep it independent. This can be useful for example if we have several Administrators but we have less of them who can actually stop/start critic operations.

I just marked `buyProduct` and `withdraw` functions as `stopInEmergency` because they are the only two that move ether from and to the contract.

## Mapping Iterator

There are a couple of mapping iterators.
To loop through all storefronts and to loop through all products.
Indirection makes code more complicated, specially for products which can be deleted. But we have the big benefit of random access to products and storefonts if we have the ID. So having the ID of a product or a storefront we don't need to loop through any collection looking for it. As you can check in the Marketplace contract there are no loops in any function.

```
uint private storefrontsCount;
mapping(uint => Storefront) private storefronts;
```

Since once a storefront is added it can't be removed them we should have keys from `1` to `storefrontsCount` available. So using function `getStorefrontCount` we can get this count and loop from `1` to `storefrontsCount` to get all store fronts.

To get all storefronts of a particular store owner we can use:
`mapping(address => uint[]) public ownerStorefrontIds;` along with function `getOwnerStorefrontCount` which gets the length of the array mapped for the store owner account. This way we can loop through  `ownerStorefrontIds[storeOwner]` array in mapping to get all storefornts Ids of a specific store owner.

Similar for products we have:

```
uint private skuCount;
mapping(uint => Product) private products;
```
But in this case we can't just go from `1` to `skuCount` to loop through all products. We need to use storefront `sku[]` array where we keep all valid products for a storefront.
