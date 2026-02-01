import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../LoadingComponent';
import ErrorComponent from '../ErrorComponent';
import { getCustomerOrders } from '../../endpoints/api';
import { getStatusDisplay, getStatusBadge } from '../../utils/order';
import { formatDate } from '../../utils/utils';
import './Customers.css';

// Компонент карточки клиента с информацией о нем и заказами
const CustomerDetail = ({ customer }) => {
  const [orders, setOrders] = useState([]);
  const [orders_count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0); 
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (isMountedRef.current) return;
    isMountedRef.current = true;
    setOrders([]);
    loadCustomerOrders(0, true); 
  }, [customer.id]);

  // Загрузка заказов клиента
  const loadCustomerOrders = async (offset = 0, reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);
    setOffset(offset);
    setError(''); 
    
    const result = await getCustomerOrders(customer.id, offset);

    if (result.success) {
      setOrders(prev => [...prev, ...result.data.results]);
      setCount(result.data.count);
      if (result.data.next) {
        setHasMore(true);
        setOffset(value => value + result.data.results.length);
      }
      else setHasMore(false);
    }
    else setError(result.error);
    
    setLoading(false);
    setLoadingMore(false); 
  };

  // Перенаправление на страницу выбранного заказа
  const handleOrderSelect = (order) => {
    navigate(`/orders/detail/${order.id}`);
  };

  return (
    <div className="customer-detail">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">
            Покупатель: {customer.first_name} {customer.last_name}
          </h5>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <h6>Личная информация</h6>
              <div className="customer-info">
                <div className="info-item">
                  <span className="label">Логин:</span>
                  <span className="value">{customer.username}</span>
                </div>
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{customer.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">Телефон:</span>
                  <span className="value">{customer.phone || 'Не указан'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Дата рождения:</span>
                  <span className="value">{customer.date_of_birth || 'Не указан'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Статус:</span>
                  <span className="value">
                    {customer.is_regular ? (
                      <span className="badge bg-success">Постоянный клиент</span>
                    ) : (
                      <span className="badge bg-secondary">Новый клиент</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <h6>Статистика</h6>
              <div className="customer-stats">
                <div className="info-item">
                  <span className="label">Общая сумма покупок: </span>
                  <span className="value">{parseFloat(customer.total_spent || 0).toFixed(2)} ₽</span>
                </div>
                <div className="info-item">
                  <span className="label">Всего заказов: </span>
                  <span className="value">{orders_count}</span>
                </div>
              </div>
            </div>
          </div>

          <h6>История заказов</h6>
          <ErrorComponent error={error} />

          {loading ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm text-primary"></div>
              <span className="ms-2">Загрузка заказов...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-cart text-muted display-6"></i>
              <p className="text-muted mt-2">У клиента пока нет заказов</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="order-item card mb-2"
                  onClick={() => handleOrderSelect(order)}
                >
                  <div className="card-body py-2">
                    <div className="row align-items-center">
                      <div className="col-md-3">
                        <strong>Заказ #{order.id}</strong>
                      </div>
                      <div className="col-md-3">
                        {formatDate(order.order_date)}
                      </div>
                      <div className="col-md-3">
                        {parseFloat(order.total_price).toFixed(2)} ₽
                      </div>
                      <div className="col-md-3">
                        <span className={getStatusBadge(order.status)}>
                          {getStatusDisplay(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
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
                onClick={() => loadCustomerOrders(offset)}
              >
                Загрузить еще
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
