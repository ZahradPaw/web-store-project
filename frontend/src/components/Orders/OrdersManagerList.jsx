import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../../endpoints/api';
import LoadingComponent from '../LoadingComponent';
import ErrorRetryComponent from '../ErrorRetryComponent';
import SearchBar from '../SearchBar';
import './Orders.css';

// Компонент списка заказов для продавца
const OrdersManagerList = () => {
  const [orders, setOrders] = useState([]);
  const [customers_filter, setCustomersFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Значок статуса заказа
  const getStatusBadge = (status) => {
    const statusConfig = {
      'created': { class: 'warning', text: 'Оформлен' },
      'paid': { class: 'info', text: 'Оплачен' },
      'delivered': { class: 'success', text: 'Доставлен' },
      'cancelled': { class: 'danger', text: 'Отменен' }
    };

    const config = statusConfig[status];
    return `badge bg-${config.class}`;
  };

  // Текст статуса доставки
  const getStatusText = (status) => {
    const statusConfig = {
      'created': 'Оформлен',
      'paid': 'Оплачен',
      'delivered': 'Доставлен',
      'cancelled': 'Отменен'
    };

    return statusConfig[status] || status;
  };

  useEffect(() => {
    loadOrders();
  }, [customers_filter]);

  // Загрузка заказов
  const loadOrders = async () => {
    setLoading(true);
    setError('');

    const result = await getOrders(customers_filter);
    
    if (result.success) {
      setOrders(result.data.results);
    }
    else 
      setError(result.error);
    setLoading(false);
  };

  // Перенаправление на страницу выбранного заказа
  const handleOrderSelect = (order) => {
    navigate(`/orders/detail/${order.id}`);
  };

  // Фильтр поиска заказов по имени клиента
  const onSearch = (filter) => {
    setCustomersFilter(filter); 
  }

  const loadingContent = (
    <div>
      <LoadingComponent text={'Загрузка заказов...'} />
    </div>
  );

  const errorContent = (
    <div>
      <ErrorRetryComponent 
        error={error}
        onClick={loadOrders}
      />
    </div>
  );

  const notOrdersFoundContent = (
    <div className="text-center py-5 empty-state">
      <i className="bi bi-cart display-1 text-muted"></i>
      <h3 className="mt-3">Ничего не найдено</h3>
    </div>
  );

  const ordersistContent = (
    <div>
      {orders.length === 0 ? (
        <div className="text-center py-5 empty-state">
          <i className="bi bi-cart display-1 text-muted"></i>
          <h3 className="mt-3">Заказы отсутствуют</h3>
          <p className="text-muted">Здесь будут отображаться все заказы</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <div className="table-responsive">
            <table className="table table-hover orders-table">
              <thead className="table-dark">
                <tr>
                  <th>Номер</th>
                  <th>Покупатель</th>
                  <th>Дата</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                  <th>Доставка</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="order-row">
                    <td>#{order.id}</td>
                    <td>{order.client_name}</td>
                    <td>{new Date(order.order_date).toLocaleDateString('ru-RU')}</td>
                    <td>{parseFloat(order.total_price).toFixed(2)} ₽</td>
                    <td>
                      <span className={getStatusBadge(order.status)}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td>
                      {order.delivery_date ? 
                        new Date(order.delivery_date).toLocaleDateString('ru-RU') : 
                        'Не указана'
                      }
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleOrderSelect(order)}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="sales-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="page-title">Заказы</h2>
          <p className="text-muted">
            Найдено заказов: {orders.length}
          </p>
        </div>
      </div>

      <SearchBar onSearch={onSearch} placeholder='Поиск по имени покупателя...' />

      {loading ? (loadingContent) : (
        error ? (errorContent) : (
          (customers_filter && orders.length === 0) ? 
            (notOrdersFoundContent) : (ordersistContent)
        )
      )}

    </div>
  );
};

export default OrdersManagerList;
