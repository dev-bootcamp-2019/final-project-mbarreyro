import React, { Component } from 'react';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      price: null,
      count: null
    };
  }

  componentDidMount() {
    this.fetchProduct();
  }

  async fetchProduct () {
    let product = await this.props.fetchProduct(this.props.sku);

    this.setState({
      name: product.name,
      price: product.price,
      count: product.count
    });
  }

  handleBuyClick () {
    this.props
      .buyProduct(this.props.sku, this.state.price)
      .then(this.buySuccess.bind(this));
  }

  buySuccess () {
    this.fetchProduct();
  }

  render() {
    return (
      <fieldset style={{display: 'inline-block'}}>
        <legend>{this.state.name}</legend>
        {this.state.price !== null &&
          <span>${this.props.web3.utils.fromWei(this.state.price)}eth</span>
        }
        ({this.state.count} in stock)
        <button disabled={parseInt(this.state.count, 10) === 0} onClick={() => this.handleBuyClick()}>
          {this.state.count > 0 ? 'Buy' : 'Out of stock'}
        </button>
      </fieldset>
    );
  }
}

export default Product;
