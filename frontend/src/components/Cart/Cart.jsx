import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import ErrorComponent from '../ErrorComponent';
import ErrorRetryComponent from '../ErrorRetryComponent';
import LoadingComponent from '../LoadingComponent';
import { createOrder, getLoyaltySettings } from '../../endpoints/api';
import './Cart.css';

// Компонент корзины с выбранными товарами
const Cart = ({ user, cart, clearCart}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    loadRegularDiscount();
  }, []);

  // Загрузка скидки для постоянных клиентов
  const loadRegularDiscount = async () => {
    setLoading(true);
    setError('');
    
    const result = await getLoyaltySettings();

    if (result.success)
      setDiscount(result.data.regular_discount);
    else
      setError(result.error);
    setLoading(false);
  };

  // Создание заказа на основе товара в корзине
  const handleCreateOrder = async () => {
    if (cart.items.length === 0)
      return;

    setLoading(true);
    setError('');

    const orderData = {
      items: cart.items.map(item => ({
        product: item.product.id,
        quantity: item.quantity
      })),
      client: user.id
    };

    const result = await createOrder(orderData);

    if (result.success) {
      // При успешном заказе очистка корзины и перенаправление на страницу заказа
      clearCart();
      navigate(`/orders/${result.data.id}`);
    }
    else
      setError(result.error);

    setLoading(false);
  };

  // Контент при загрузке
  if (loading) {
   return (
      <div>
        <LoadingComponent text={'Загрузка товаров...'} />
      </div>
    );
  }

  // Контент при ошибке
  if (error) {
    return (
      <div>
        <ErrorRetryComponent 
          error={error}
          onClick={loadRegularDiscount}
        />
      </div>
    );
  }

  // Пустая корзина
  if (cart.items.length === 0) {
    return (
      <div className="container py-4">
        <div className="text-center empty-cart">
          <i className="bi bi-cart-x display-1 text-muted"></i>
          <h3 className="mt-3">Корзина пуста</h3>
          <p className="text-muted">Добавьте товары из каталога</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Вернуться к товарам
          </button>
        </div>
      </div>
    );
  }

  // Корзина с выбранными товарами
  return (
    <div>
      <div className="row">
        <div className="col-12">
          <h2 className="page-title">Корзина</h2>
          <p className="text-muted">Товаров в корзине: {cart.items.length}</p>
        </div>
      </div>

      <ErrorComponent error={error} />

      <div className="row">
        <div className="col-lg-8">
          <div className="cart-items">
            {cart.items.map(item => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          <CartSummary
            onCreateOrder={handleCreateOrder}
            discount={discount}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
