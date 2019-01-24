import React, { Component } from 'react';

class StorefrontProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sku: props.sku,
      name: null,
      price: 0,
      count: 0
    };
  }

  componentDidMount () {
    this.fetchProduct();
  }

  async fetchProduct () {
    let product = await this.props.fetchProduct(this.state.sku);

    this.setState({
      name: product.name,
      price: product.price,
      count: product.count
    });
  }

  handleDeleteClick () {
    this.props.deleteProduct(this.state.sku);
  }

  handlePriceChange (value) {
    this.setState({
      price: value
    });
  }

  handleCountChange (value) {
    this.setState({
      count: value
    });
  }

  handleUpdatePriceClick() {
    this.props.updateProductPrice(this.state.sku, this.state.price);
  }

  handleUpdateCountClick() {
    this.props.updateProductCount(this.state.sku, this.state.count);
  }

  render () {
    return (
      <div style={{margin: '20px'}}>
        <fieldset>
          <legend># {this.state.sku} {this.state.name}</legend>
          Price: <input type='number' value={this.state.price} onChange={e => this.handlePriceChange(e.target.value)} />
          <button onClick={() => this.handleUpdatePriceClick()}>Update Price</button>
          Count: <input type='number' value={this.state.count} onChange={e => this.handleCountChange(e.target.value)} />
          <button onClick={() => this.handleUpdateCountClick()}>Update Count</button>
          <button onClick={() => this.handleDeleteClick()}>Delete</button>
        </fieldset>
      </div>
    );
  }
}

export default StorefrontProduct;
