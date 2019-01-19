import React, { Component } from "react";

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      disabled: false,
      status: '',
      lastReceipt: '',
      sentAddress: ''
    };
  }

  handleInput(value) {
    this.setState({
      address: value,
    });
  }

  handleAddClick() {
    this.setState({
      disabled: true,
      sentAddress: this.state.address,
      status: `adding address... ${this.state.address}`
    });

    this.props.addNewStoreOwner(this.state.address)
      .then(this.onAddSuccess.bind(this))
      .catch(this.onAddError.bind(this));
  }

  onAddSuccess(receipt) {
    this.setState({
      disabled: false,
      address: '',
      status: `Address ${this.state.sentAddress} added`,
      lastReceipt: receipt.toString()
    });

    console.log(receipt);
  }

  onAddError(receipt) {
    this.setState({
      disabled: false,
      status: 'Failed to add address',
      lastReceipt: receipt.toString()
    });

    console.log(receipt);
  }

  render() {
    return (
      <div>
        <h1>Welcome to your dashboard</h1>
        <p><i>{this.state.status}</i></p>
        <label>
          Add a new Owner:
          <input type='text' value={this.state.address} name='address' onChange={e => this.handleInput(e.target.value)} />
        </label>
        <button onClick={() => this.handleAddClick()} disabled={this.state.disabled}>Add</button>
        <pre>
          {this.state.lastReceipt}
        </pre>
      </div>
    );
  }
}

export default AdminDashboard;
