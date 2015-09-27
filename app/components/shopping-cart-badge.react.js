let React = require('react');

class ShoppingCartBadge extends React.Component {
  render() {
    let navigateToShoppingCart = () => {
      this.props.navigate('/shopping-cart');
    };

    return <div className='shopping-cart-badge' onClick={navigateToShoppingCart}>
      Shopping Cart Overview
      <div className='article-count'>{this.props.shoppingCartInfo.articleCount}</div>
      <div className='total-price'>{this.props.shoppingCartInfo.totalPrice / 100}</div>
    </div>;
  }
}

ShoppingCartBadge.propTypes = {
  shoppingCartInfo: React.PropTypes.object.isRequired
};
module.exports = ShoppingCartBadge;