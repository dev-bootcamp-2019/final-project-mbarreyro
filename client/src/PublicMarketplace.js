import React, { Component } from 'react';
import Product from './Product';

class PublicMarketplace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storefronts: null
    };
  }

  componentDidMount() {
    this.fetchStorefronts();
  }

  async fetchStorefronts() {
    let storefronts = await this.props.fetchMarketplaceStorefronts();

    this.setState({
      storefronts
    });
  }

  buyProduct(sku, price, amount) {
    return this.props.buyProduct(sku, price, amount)
      .then(this.buySuccess.bind(this))
      .catch(this.buyError.bind(this));
  }

  buySuccess(receipt) {
    this.fetchStorefronts();
    console.log(receipt);
  }

  buyError(receipt) {
    console.log(receipt);
  }

  render() {
    return (
      <div>
        <h1>Welcome to this marketplace</h1>
        {this.state.storefronts !== null && this.state.storefronts.length > 0 &&
          this.state.storefronts.map(s => (
            <div key={s.id}>
              <h2>{s.name}</h2>
              {s.skus.length > 0 &&
                s.skus.map(sku => (
                  <Product
                    web3={this.props.web3}
                    key={sku}
                    sku={sku}
                    fetchProduct={this.props.fetchProduct}
                    buyProduct={this.buyProduct.bind(this)}
                  />
                ))
              }
            </div>
          ))
        }
      </div>
    );
  }
}

export default PublicMarketplace;
