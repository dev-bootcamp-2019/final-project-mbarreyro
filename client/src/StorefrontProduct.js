import React, { Component } from 'react';

class StorefrontProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sku: props.sku,
      name: null,
      price: null,
      count: null
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

  render () {
    return (
      <div>
        # {this.state.sku} {this.state.name} Price: {this.state.price} Count: {this.state.count}.
        <button>Update</button>
        <button onClick={() => this.handleDeleteClick()}>Delete</button>
      </div>
    );
  }
}

export default StorefrontProduct;
