import React, { Component } from 'react';

class OwnerDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      status: '',
      newStorefrontName: '',
      sentStorefrontName: '',
      storefronts: []
    };
  }

  componentDidMount() {
    this.setState({
      status: 'Fetching storefronts...'
    });

    this.props.fetchOwnerStorefronts()
      .then(this.onFetchSuccess.bind(this))
      .catch(this.onFetchError.bind(this));
  }

  onFetchSuccess(storefronts) {
    this.setState({
      status: `Found ${storefronts.length} storefronts`,
      storefronts
    });

    console.log(storefronts);
  }

  onFetchError(error) {
    this.setState({
      status: 'Failed to fetch storefronts',
      lastReceipt: error
    });

    console.log(arguments);
  }

  handleAddStorefrontInputChange(value) {
    this.setState({
      newStorefrontName: value
    });
  }

  handleAddClick() {
    this.setState({
      disabled: true,
      sentStorefrontName: this.state.newStorefrontName,
      status: `Adding storefront... ${this.state.newStorefrontName}`
    });

    this.props.addNewStorefront(this.state.newStorefrontName)
      .then(this.onAddSuccess.bind(this))
      .catch(this.onAddError.bind(this));
  }

  onAddSuccess(receipt) {
    this.setState({
      disabled: false,
      newStorefrontName: '',
      status: `New storefront ${this.state.sentStorefrontName} added`,
      lastReceipt: receipt.toString()
    });

    console.log(receipt);
    this.props.fetchOwnerStorefronts()
      .then(this.onFetchSuccess.bind(this))
      .catch(this.onFetchError.bind(this));
  }

  onAddError(receipt) {
    this.setState({
      disabled: false,
      status: 'Failed to add storefront',
      lastReceipt: receipt.toString()
    });

    console.log(receipt);
  }

  render() {
    return (
      <div>
        <h1>Welcome to your storefronts dashboard</h1>
        <p><i>{this.state.status}</i></p>
        {this.state.storefronts.length > 0 &&
          <div>
            <h2>Storefronts</h2>
            <ul>
              {this.state.storefronts.map((s, i) => (
                <li key={i}>{s.name}</li>
              ))}
            </ul>
          </div>
        }

        <div>
          <label>
            Add new storefront:
            <input type='string' onChange={e => this.handleAddStorefrontInputChange(e.target.value)}/>
            <button disabled={this.state.disabled} onClick={() => this.handleAddClick()} >Add</button>
          </label>
        </div>
        <pre>
          {this.state.lastReceipt}
        </pre>
      </div>
    )
  }
}

export default OwnerDashboard;
