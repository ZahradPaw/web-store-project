import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getOrders } from '../../endpoints/api';
import LoadingComponent from '../LoadingComponent';
import ErrorRetryComponent from '../ErrorRetryComponent';
import SearchBar from '../SearchBar';
import { getUnitDisplay } from '../../utils/product';
import { getStatusDisplay, getStatusBadge } from '../../utils/order';
import { formatDate } from '../../utils/utils';
import './Orders.css';

// Компонент списка заказов для продавца
const OrdersManagerList = () => {
  const [orders, setOrders] = useState([]);
  const [customers_filter, setCustomersFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const navigate = useNavigate();

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

  // Развернуть/свернуть товары в заказе
  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const isExpanded = expandedOrders.has(order.id);

                  return (
                    <React.Fragment key={order.id}>
                      <tr className="order-row">
                        <td>#{order.id}</td>
                        <td>
                          <Link to={`/customer/${order.client}`}>{order.client_name}</Link>
                        </td>
                        <td>{formatDate(order.order_date)}</td>
                        <td>{parseFloat(order.total_price).toFixed(2)} ₽</td>
                        <td>
                          <span className={getStatusBadge(order.status)}>
                            {getStatusDisplay(order.status)}
                          </span>
                        </td>
                        <td>
                          {order.delivery_date ? 
                            formatDate(order.delivery_date) : 
                            'Не указана'
                          }
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleOrderSelect(order)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => toggleOrderExpansion(order.id)}
                            title={isExpanded ? 'Свернуть товары' : 'Развернуть товары'}
                          >
                            <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                          </button>
                        </td>
                      </tr>

                      {/* Строка с товарами заказа */}
                      {isExpanded && order.items && (
                        <tr className="order-details-row">
                          <td colSpan='10'>
                            <div className="order-items-container">
                              <div className="table-responsive">
                                <table className="table table-sm table-bordered">
                                  <thead>
                                    <tr>
                                      <th>Товар</th>
                                      <th>Количество</th>
                                      <th>Цена за ед.</th>
                                      <th>Общая цена</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.items.map((item, index) => (
                                      <tr key={index}>
                                        <td>
                                          <div>
                                            <strong>{item.product_name || 'Товар'}</strong>
                                            {item.product_unit && (
                                              <small className="text-muted ms-2">
                                                ({getUnitDisplay(item.product_unit)})
                                              </small>
                                            )}
                                          </div>
                                        </td>
                                        <td>
                                          {parseFloat(item.quantity)}
                                        </td>
                                        <td>
                                          {parseFloat(item.price || item.unit_price || 0).toFixed(2)} ₽
                                        </td>
                                        <td>
                                          <strong>
                                            {parseFloat(item.total || (
                                              item.quantity * (
                                                item.price || item.unit_price || 0))).toFixed(2)} ₽
                                          </strong>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
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
