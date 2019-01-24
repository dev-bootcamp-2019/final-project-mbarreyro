import React, { Component } from 'react';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      price: null,
      count: null,
      selectedAmount: 1
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
      .buyProduct(this.props.sku, this.state.price, this.state.selectedAmount)
      .then(this.buySuccess.bind(this));
  }

  buySuccess () {
    this.fetchProduct();
    this.setState({
      selectedAmount: 1
    });
  }

  handleSelectedAmountChange(selectedAmount) {
    this.setState({
      selectedAmount
    });
  }

  render() {
    return (
      <fieldset style={{display: 'inline-block'}}>
        <legend>{this.state.name}</legend>
        {this.state.price !== null &&
          <span>${this.props.web3.utils.fromWei(this.state.price)}eth</span>
        }
        ({this.state.count} in stock)
        <input
          type='number'
          disabled={parseInt(this.state.count, 10) === 0}
          min={1} max={this.state.count}
          value={this.state.selectedAmount}
          onChange={e => this.handleSelectedAmountChange(e.target.value)}
        />
        <button disabled={parseInt(this.state.count, 10) === 0} onClick={() => this.handleBuyClick()}>
          {this.state.count > 0 ? 'Buy' : 'Out of stock'}
        </button>
      </fieldset>
    );
  }
}

export default Product;
