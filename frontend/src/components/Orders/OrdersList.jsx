import React, { useState, useEffect } from 'react';
import OrderCard from './OrderCard';
import LoadingComponent from '../LoadingComponent';
import ErrorRetryComponent from '../ErrorRetryComponent';
import { getOrders } from '../../endpoints/api';
import './Orders.css';

// Компонент списка заказов
const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  // Загрузка заказов по API
  const loadOrders = async () => {
    setLoading(true);
    setError('');

    const result = await getOrders();

    if (result.success)
      setOrders(result.data.results);
    else
      setError(result.error);
    setLoading(false);
  };

  // Контент при загрузке
  if (loading) {
   return (
      <div>
        <LoadingComponent text={'Загрузка заказов...'} />
      </div>
    );
  }

  // Контент при ошибке
  if (error) {
    return (
      <div>
        <ErrorRetryComponent 
          error={error}
          onClick={loadOrders}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="page-title">Мои заказы</h2>
          <p className="text-muted">
            Всего заказов: {orders.length}
          </p>
        </div>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-5 empty-orders">
          <i className="bi bi-cart display-1 text-muted"></i>
          <h3 className="mt-3">Заказов пока нет</h3>
          <p className="text-muted">Сделайте ваш первый заказ в каталоге товаров</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.href = '/products'}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Перейти к товарам
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
