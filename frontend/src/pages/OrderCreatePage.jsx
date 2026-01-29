import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderCreateCard from '../components/Orders/OrderCreateCard';
import usePageTitle from '../hooks/usePageTitle';

// Страница создания заказа продавцом
const OrderCreatePage = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  usePageTitle("Оформление продажи");

  // Перенаправление на страницу созданого заказа через 2 секунды
  const handleSubmit = (order) => {
    setSuccess(true);
    setTimeout(() => {
      navigate(`/orders/detail/${order.id}`);
    }, 2000);
  };

  // Контент при успешном оформлении продажи
  if (success) {
    return (
      <div className="container py-4">
        <div className="alert alert-success text-center">
          <i className="bi bi-check-circle display-4 text-success mb-3"></i>
          <h3>Продажа успешно оформлена!</h3>
          <p>Перенаправление на страницу заказа...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <OrderCreateCard
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default OrderCreatePage;
