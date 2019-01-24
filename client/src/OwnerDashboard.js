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
      status: 'Fetching storefronts...'
    });

    this.props.fetchOwnerStorefronts()
      .then(this.onFetchSuccess.bind(this))
      .catch(this.onFetchError.bind(this));

    this.props.fetchOwnerBalance()
      .then(this.onBalanceSuccess.bind(this))
      .catch(this.onBalanceError.bind(this));;
  }

  onFetchSuccess(storefronts) {
    this.setState({
      status: `Found ${storefronts.length} storefronts`,
      storefronts
    });

    if (this.state.currentStorefrontIndex !== null) {
      let storefront = this.state.storefronts[this.state.currentStorefrontIndex];

      this.setState({
        currentStorefrontId: storefront.id,
        currentStorefrontName: storefront.name,
        currentStorefrontSkus: storefront.skus
      })
    }

    console.log(storefronts);
  }

  onFetchError(error) {
    this.setState({
      status: 'Failed to fetch storefronts',
      lastReceipt: error
    });

    console.log(arguments);
  }

  onBalanceSuccess(balance) {
    this.setState({
        balance
    });
  }

  onBalanceError(receipt) {
    this.setState({
      status: 'An error occurred while trying to get your balance',
      lastReceipt: receipt.toString()
    });

    console.log(receipt);
  }

  onFetchStorefrontSuccess(storefront) {
    this.setState({
      status: `Fetching store ${this.state.currentStorefrontName} data...`

    });
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

    this.props.fetchOwnerStorefronts()
      .then(this.onFetchSuccess.bind(this))
      .catch(this.onFetchError.bind(this));
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

    this.props.fetchOwnerStorefronts()
      .then(this.onFetchSuccess.bind(this))
      .catch(this.onFetchError.bind(this));
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

    this.props.fetchOwnerStorefronts()
      .then(this.onFetchSuccess.bind(this))
      .catch(this.onFetchError.bind(this));
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

    this.props.fetchOwnerStorefronts()
      .then(this.onFetchSuccess.bind(this))
      .catch(this.onFetchError.bind(this));
  }

  updateProductCountError(receipt) {
    this.setState({
      status: 'An error occurred when trying to update product',
      lastReceipt: receipt.toString()
    });

    console.log(receipt);
  }

  render() {
    return (
      <div>
        <h1>Welcome to your storefronts dashboard</h1>
        <p><i>{this.state.status}</i></p>
        <div>
          <h2>Your balance is: {this.state.balance}</h2>
          <button>Withdraw</button>
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
            <button disabled={this.state.disabled} onClick={() => this.handleAddClick()} >Add</button>
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
                key={i}
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
