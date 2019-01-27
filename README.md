# Marketplace (2018-2019 Developer Program Final Project)

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
