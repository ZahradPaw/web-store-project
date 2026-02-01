import React, { useState, useEffect, useRef } from 'react';
import OrderCard from './OrderCard';
import LoadingComponent from '../LoadingComponent';
import ErrorRetryComponent from '../ErrorRetryComponent';
import { getOrders } from '../../endpoints/api';
import './Orders.css';

// Компонент списка заказов для покупателей
const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0); 
  const [error, setError] = useState('');
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (isMountedRef.current) return;
    isMountedRef.current = true;
    setOrders([]);
    loadOrders(0, true);
  }, []);

  // Загрузка заказов по API
  const loadOrders = async (offset = 0, reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);
    setOffset(offset);
    setError(''); 

    const result = await getOrders('', offset);

    if (result.success) {
      setOrders(prev => [...prev, ...result.data.results]);
      setCount(result.data.count);
      if (result.data.next) {
        console.log(offset);
        setHasMore(true);
        setOffset(value => value + result.data.results.length);
      }
      else setHasMore(false);
    }
    else setError(result.error);

    setLoading(false);
    setLoadingMore(false);
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
            Всего заказов: {count}
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

      {loadingMore && (
        <LoadingComponent text={'Загрузка заказов...'} />
      )}

      {!loading && !loadingMore && hasMore && (
        <div className="text-center my-4">
          <button 
            className="btn btn-primary"
            onClick={() => loadOrders(offset)}
          >
            Загрузить еще
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
