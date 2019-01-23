import React, { Component } from 'react';

class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
        storeId: props.storeId,
        name: '',
        price: '',
        count: ''
    };
  }

  handleNameChange (value) {
    this.setState({
      name: value
    })
  }

  handlePriceChange (value) {
    this.setState({
      price: value
    })
  }

  handleCountChange (value) {
    this.setState({
      count: value
    })
  }

  handleAddClick() {
    this.props.addProduct(
      this.state.name,
      this.state.count,
      this.state.price,
      this.clear.bind(this)
    );
  }

  clear() {
    this.setState({
      name: '',
      price: '',
      count: ''
    });
  }

  render () {
    return (
      <div>
        <h4>Add new product:</h4>
        <label>
          Name:
          <input type='text' value={this.state.name} onChange={e => this.handleNameChange(e.target.value)}/>
        </label>
        <label>
          Price:
          <input type='number' value={this.state.price} min={0} onChange={e => this.handlePriceChange(e.target.value)}/>
        </label>
        <label>
          Count:
          <input type='number' value={this.state.count} min={0} onChange={e => this.handleCountChange(e.target.value)}/>
        </label>
        <button disabled={this.props.disabled} onClick={() => this.handleAddClick()}>Add</button>
      </div>
    );
  }
}

export default AddProduct;
