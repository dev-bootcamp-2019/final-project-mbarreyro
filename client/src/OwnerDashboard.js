import React, { Component } from 'react';
import AddProduct from './AddProduct';
import StorefrontProduct from './StorefrontProduct';

class OwnerDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      status: '',
      balance: 0,
      newStorefrontName: '',
      sentStorefrontName: '',
      currentStorefrontId: null,
      currentStorefrontName: null,
      currentStorefrontIndex: null,
      currentStorefrontSkus: null,
      storefronts: [],
      disabledProductAdd: false
    };
  }

  componentDidMount() {
    this.setState({
      status: 'Fetching owner data...'
    });

    this.fetchOwnerData();
  }

  async fetchOwnerData() {
    let storefronts, balance;

    storefronts = await this.props.fetchOwnerStorefronts();
    balance = await this.props.fetchOwnerBalance();

    let updates = {
        status: `Found ${storefronts.length} storefronts.`,
        balance,
        storefronts
    };

    if (this.state.currentStorefrontIndex !== null) {
      let storefront = storefronts[this.state.currentStorefrontIndex];

      updates = Object.assign(updates, {
        currentStorefrontId: storefront.id,
        currentStorefrontName: storefront.name,
        currentStorefrontSkus: storefront.skus
      });
    }

    this.setState(updates);
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
    this.fetchOwnerData();
  }

  onAddError(receipt) {
    this.setState({
      disabled: false,
      status: 'Failed to add storefront',
      lastReceipt: receipt.toString()
    });

    console.log(receipt);
  }

  onManageClick(storeIndex) {
    this.setState({
      currentStorefrontId: this.state.storefronts[storeIndex].id,
      currentStorefrontName: this.state.storefronts[storeIndex].name,
      currentStorefrontSkus: this.state.storefronts[storeIndex].skus,
      currentStorefrontIndex: storeIndex
    });
  }

  addProduct(name, count, price, callback) {
    this.setState({
      status: `Adding new product "${name}" ...`,
      sentNewProductName: name,
      disabledProductAdd: true
    });

    this.props.addProduct(this.state.currentStorefrontId, name, count, price)
      .then(this.onAddProductSuccess.bind(this, callback))
      .catch(this.onAddProductError.bind(this));
  }

  onAddProductSuccess(callback, receipt) {
    this.setState({
      status: `New product "${this.state.sentNewProductName}" added`,
      disabledProductAdd: false,
      lastReceipt: receipt.toString()
    });

    callback();

    this.fetchOwnerData();
  }

  onAddProductError(receipt) {
    this.setState({
      status: `An error occurred while adding product "${this.state.sentNewProductName}"`,
      disabledProductAdd: false,
      lastReceipt: receipt.toString()
    });

    console.log(receipt);
  }

  deleteProduct(sku) {
    this.setState({
      status: `Attempting to delete ${sku} product`,
    });

    this.props.deleteProduct(sku)
      .then(this.onDeleteProductSuccess.bind(this))
      .catch(this.onDeleteProductError.bind(this));
  }

  onDeleteProductSuccess(receipt) {
    this.setState({
      status: 'Product deleted successfully',
      lastReceipt: receipt.toString()
    });

    console.log(receipt);

    this.fetchOwnerData();
  }

  onDeleteProductError(receipt) {
    this.setState({
      status: 'An error occurred when trying to delete product',
      lastReceipt: receipt.toString()
    });

    console.log(receipt);
  }

  updateProductPrice(sku, price) {
    this.setState({
      status: 'Updating product price...'
    });

    this.props.updateProductPrice(sku, price)
      .then(this.updateProductPriceSuccess.bind(this))
      .catch(this.updateProductPriceError.bind(this));
  }

  updateProductPriceSuccess(receipt) {
    this.setState({
      status: 'Product price updated successfully',
      lastReceipt: receipt.toString()
    });

    console.log(receipt);

    this.fetchOwnerData();
  }

  updateProductPriceError(receipt) {
    this.setState({
      status: 'An error occurred when trying to update product',
      lastReceipt: receipt.toString()
    });

    console.log(receipt);
  }

  updateProductCount(sku, count) {
    this.setState({
      status: 'Updating product count...'
    });

    this.props.updateProductCount(sku, count)
      .then(this.updateProductCountSuccess.bind(this))
      .catch(this.updateProductCountError.bind(this));
  }

  updateProductCountSuccess(receipt) {
    this.setState({
      status: 'Product count updated successfully',
      lastReceipt: receipt.toString()
    });

    console.log(receipt);

    this.fetchOwnerData();
  }

  updateProductCountError(receipt) {
    this.setState({
      status: 'An error occurred when trying to update product',
      lastReceipt: receipt.toString()
    });

    console.log(receipt);
  }

  handleWithdrawClick() {
    this.props.withdraw()
      .then(this.fetchOwnerData.bind(this))
      .catch((receipt) => console.log(receipt));
  }

  render() {
    return (
      <div>
        <h1>Welcome to your storefronts dashboard</h1>
        <p><i>{this.state.status}</i></p>
        <div>
          <h2>
            Your balance is:
            {this.state.balance !== null &&
              <span>${this.props.web3.utils.fromWei(this.state.balance.toString())}eth</span>
            }
          </h2>
          <button onClick={() => this.handleWithdrawClick()}>Withdraw</button>
        </div>
        {this.state.storefronts.length > 0 &&
          <div>
            <h2>Storefronts</h2>
            <ul>
              {this.state.storefronts.map((s, i) => (
                <li key={i}>{s.name}({s.id})<button onClick={() => this.onManageClick(i)}>Manage</button></li>
              ))}
            </ul>
          </div>
        }
        <div>
          <label>
            Add new storefront:
            <input type='string' onChange={e => this.handleAddStorefrontInputChange(e.target.value)}/>
            <button disabled={this.state.disabled} value={this.newStorefrontName} onClick={() => this.handleAddClick()}>Add</button>
          </label>
        </div>
        {this.state.currentStorefrontIndex !== null &&
          <div>
            <h2>Managing Storefront # {this.state.currentStorefrontId} {this.state.currentStorefrontName}</h2>
            <div>
              <AddProduct
                disabled={this.state.disabledProductAdd}
                storeId={this.state.currentStorefrontId}
                addProduct={this.addProduct.bind(this)}
              />
            </div>
          </div>
        }
        {this.state.currentStorefrontSkus !== null && this.state.currentStorefrontSkus !== null &&
          this.state.currentStorefrontSkus.map((sku, i) => (
              <StorefrontProduct
                key={sku}
                sku={sku}
                fetchProduct={this.props.fetchProduct}
                deleteProduct={this.deleteProduct.bind(this)}
                updateProductPrice={this.updateProductPrice.bind(this)}
                updateProductCount={this.updateProductCount.bind(this)}
              />
          ))
        }
        <pre>
          {this.state.lastReceipt}
        </pre>
      </div>
    )
  }
}

export default OwnerDashboard;
