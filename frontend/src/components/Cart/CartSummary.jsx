import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useCartContext } from '../../contexts/CartContext';
import './Cart.css';

// Компонент корзины со всеми товарами
const CartSummary = ({ onCreateOrder, discount }) => {
  const { cart, clearCart } = useCartContext();
  const { user } = useAuthContext();

  // Вычисление скидки для постоянного клиента
  const discountAmount = user?.is_regular ? (cart.total * (discount / 100)) : 0;
  const finalTotal = cart.total - discountAmount;

  return (
    <div className="cart-summary card">
      <div className="card-body">
        <h5 className="card-title summary-title">Итог заказа</h5>

        <div className="summary-details">
          <div className="d-flex justify-content-between mb-2">
            <span>Товары:</span>
            <span>{cart.total.toFixed(2)} ₽</span>
          </div>

          {user?.is_regular && (
            <div className="d-flex justify-content-between mb-2 text-success">
              <span>Скидка для постоянных клиентов: {parseFloat(discount)}%:</span>
              <span>-{discountAmount.toFixed(2)} ₽</span>
            </div>
          )}

          <hr />

          <div className="d-flex justify-content-between mb-3 total-amount">
            <strong>Итого:</strong>
            <strong>{finalTotal.toFixed(2)} ₽</strong>
          </div>
        </div>

        <div className="d-grid gap-2">
          <button
            className="btn btn-primary checkout-btn"
            onClick={onCreateOrder}
            disabled={cart.items.length === 0}
          >
            Оформить заказ
          </button>

          <button
            className="btn btn-outline-secondary clear-btn"
            onClick={clearCart}
            disabled={cart.items.length === 0}
          >
            <i className="bi bi-trash me-2"></i>
            Очистить корзину
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
