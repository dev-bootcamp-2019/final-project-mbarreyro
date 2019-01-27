# Marketplace (2018-2019 Developer Program Final Project)

My name is Martín Ernesto Barreyro and you can reach me at barreyromartin@gmail.com.

This application allows store owners (registered by admin accounts) add different storefronts to sell products.
Any user (without being an account registered in this Marketplace) can browse storefronts and buy their products.
Storefront owners that have sold products in this Marketplace can withdraw any founds gathered from these operations.

## Setting up

This application is based in truffle box [react](https://truffleframework.com/boxes/react).

You need to have nodejs, truffle and your OS build essential tools installed.

It was tested using Metamask chrome extension.

Clone project:

```
$ git clone git@github.com:mbarreyro/eth-marketplace.git
$ cd eth-marketplace/
```

This project was developed with Metamask.

Check `truffle.js` file for settings. It contains basic configuration to connect to a local instance of ganache.

```
networks: {
  development: {
    host: "localhost",
    port: 8545,
    network_id: "*" // Match any network id
  }
}
```

Run ganache:

`$ ganache-cli --host 0.0.0.0`

Option `--host 0.0.0.0` makes ganache accept connections from any host. This is useful if you run it in a VM box (with Vagrant for example) and you need to connect from Metamask at your host computer.

Compile and migrate:

`$ truffle compile`
`$ truffle migrate`

Run tests:

`$ truffle test`

To run the web application you need to:

`$ cd client/`
`$ npm install`
`$ npm run start`

You should be prompted with the URLs where the development server is running. Access it using your browser.

If you are running this inside a Vagrant VM you'll need to set up forwarded ports for ganache and for this development http server. So you can connect from your browser and from Metamask.

## Usage

When you run ganache-cli you should be prompted with available accounts to use for this application. First two accounts are set to be Admins of the Market place. Import one of the two in Metamask and select to operate in the app.

You should see an input that allows you to add store owners. Add one of the addresses of the other accounts available in ganache.
Import the address of this new store owner to Metamask and select it to work with. Then reload the site.

You should see now the storefront owner dashboard. You can add storefronts. After you add a new storefront you should see it listed. Click on "manage" button. You can now add products, update existing products price and count, and you can delete them.

Add some products. Then import another account from ganache (not an admin, not a store owner) and reload the app.

You should see the public part of the Marketplace. You should see listed all storefronts with all their products. Buy some products.

Then select again the account for the store owner in Metamask. Reload and check your balance. It should be more than 0 now that you have sold some products.

You can now withdraw ether from your balance. Input an amount of ether you want to withdraw and click the "Withdraw" button.
You should have now your balance reduced buy the amount you specified and you can check your ether using Metamask.

That's the basic use. You can now play with the app!
