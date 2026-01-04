import React from 'react';
import { useCartContext } from '../../contexts/CartContext';
import { UNITS, getUnitDisplay } from '../../utils/product';
import './Cart.css';

// Компонент элемента корзины
const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCartContext();

  // Изменение кол-во товара в корзине
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0)
      removeFromCart(item.product.id);
    else
      updateQuantity(item.product.id, parseFloat(newQuantity).toFixed(2));

  };

  const itemTotal = parseFloat(item.product.price) * parseFloat(item.quantity);

  return (
    <div className="cart-item card mb-3">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h6 className="cart-item-title">{item.product.name}</h6>
            <div className="cart-item-details">
              <span className="cart-item-price">{parseFloat(item.product.price).toFixed(2)} ₽</span>
              <span className="cart-item-unit">за {getUnitDisplay(item.product.unit)}</span>
            </div>
          </div>

          <div className="col-md-4">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-secondary btn-sm quantity-btn"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <strong>-</strong>
              </button>

              <input
                type="number"
                className="form-control quantity-input mx-2"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(parseFloat(e.target.value).toFixed(2) || 0)}
                min={item.product.unit === UNITS.PIECES ? '1' : '0.1'}
                step={item.product.unit === UNITS.PIECES ? '1' : '0.1'}
              />

              <button
                className="btn btn-outline-secondary btn-sm quantity-btn"
                onClick={() => handleQuantityChange(item.quantity + 1)}
              >
                <strong>+</strong>
              </button>
            </div>
          </div>

          <div className="col-md-2 text-end">
            <div className="cart-item-total">
              {itemTotal.toFixed(2)} ₽
            </div>
            <button
              className="btn btn-outline-danger btn-sm mt-2 remove-btn"
              onClick={() => removeFromCart(item.product.id)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
