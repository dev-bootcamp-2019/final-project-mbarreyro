import React, { Component } from "react";
import Marketplace from "./contracts/Marketplace.json";
import AdminDashboard from "./AdminDashboard";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null, isAdmin: false, isOwner: false };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Marketplace.networks[networkId];
      const instance = new web3.eth.Contract(
        Marketplace.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.initState);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  initState = async () => {
    const { accounts, contract } = this.state;
    const isAdmin = await contract.methods.isAdmin(accounts[0]).call();
    const isOwner = await contract.methods.storeOwners(accounts[0]).call();

    this.setState({ isAdmin, isOwner })
  }

  addNewStoreOwner = async address => {
    const { accounts, contract } = this.state;

    return contract.methods.addStoreOwner(address).send({from: accounts[0]});
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Welcome to this Marketplace</h1>

        {this.state.isAdmin && <AdminDashboard addNewStoreOwner={this.addNewStoreOwner} />}
        {this.state.isOwner && <h3>You are an Owner!</h3>}
        {!this.state.isAdmin && !this.state.isOwner && <h3>You are a customer!</h3>}
      </div>
    );
  }
}

export default App;
