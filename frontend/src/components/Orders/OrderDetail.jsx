import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../LoadingComponent';
import ErrorComponent from '../ErrorComponent';
import ErrorRetryComponent from '../ErrorRetryComponent';
import { getOrder, cancelOrder } from '../../endpoints/api';
import './Orders.css';

// Компонент деталей заказа для клиента
const OrderDetail = ({ order_id }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadOrder();
  }, [order_id]);
  
  // Загрузка заказа по его ID
  const loadOrder = async () => {
    setLoading(true);
    setError('');

    const result = await getOrder(order_id);

    if (result.success)
      setOrder(result.data);
    else
      setError(result.error);
    setLoading(false);
  };

  // Значок статуса заказа
  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { class: 'warning', text: 'Ожидание' },
      'confirmed': { class: 'info', text: 'Подтвержден' },
      'delivered': { class: 'success', text: 'Доставлен' },
      'cancelled': { class: 'danger', text: 'Отменен' }
    };

    const config = statusConfig[status];
    return `badge bg-${config.class}`;
  };

  // Текст статуса доставки
  const getStatusText = (status) => {
    const statusConfig = {
      'pending': 'Ожидание подтверждения',
      'confirmed': 'Подтвержден',
      'delivered': 'Доставлен',
      'cancelled': 'Отменен'
    };

    return statusConfig[status] || status;
  };

  // Вычисление стоимости заказа без скидки
  const getOrderPriceWithoutDiscount = (orderItems) => {
    let res = 0;
    for (let item of orderItems) {
      res += parseFloat(item.total);
    }
    return res.toFixed(2);
  }

  // Локализация дат
  const formatDate = (dateString) => {
    if (!dateString) return 'Не указана';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  // Локализация даты-времени
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  // Отображение единиц товара
  const getUnitDisplay = (unit) => {
    const units = {
      'pieces': 'шт',
      'kg': 'кг',
      'liter': 'л'
    };
    return units[unit] || unit;
  };

  // Проверка, можно ли отменить заказ
  const canBeCancelled = () => {
    return order.status === 'pending' || order.status === 'confirmed';
  };
  
  // Отмена заказа
  const handleCancelOrder = async () => {
    setLoading(true);
    setError('');

    const result = await cancelOrder(order.id);

    if (result.error) {
      setError(result.error);
    }
    else {
      // Перенаправление на страницу заказов
      navigate('/orders');
    }
  }

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
          onClick={loadOrder}
        />
      </div>
    );
  }

  return (
    <div className="order-detail">
      {/* Заголовок и статус */}
      <div className="row mb-4">
        <div className="col-md-6">
          <h3 className="order-title">Заказ #{order.id}</h3>
          <p className="text-muted">
            Создан: {formatDateTime(order.order_date)}
          </p>
        </div>
      </div>

      {/* Информация о заказе */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">Информация о заказе</h6>
              <div className="order-info">
                <div className="info-item">
                  <span className="label">Дата создания:</span>
                  <span className="value">{formatDateTime(order.order_date)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Дата доставки:</span>
                  <span className="value">{formatDate(order.delivery_date)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Статус:</span>
                  <span className="value">
                    <span className={getStatusBadge(order.status)}>
                      {getStatusText(order.status)}
                    </span>
                  </span>
                </div>
                {canBeCancelled() && (
                  <div className="info-item">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={handleCancelOrder}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Отмена...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-x-circle me-2"></i>
                          Отменить заказ
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Сумма заказа */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">Стоимость</h6>
              <div className="order-pricing">
                <div className="pricing-item">
                  <span>Сумма заказа:</span>
                  <span>{getOrderPriceWithoutDiscount(order.items)} ₽</span>
                </div>
                {(
                  <div className="pricing-item text-success">
                    <span>Скидка:</span>
                    <span>-{parseFloat(getOrderPriceWithoutDiscount(order.items) -
                      order.total_price).toFixed(2)} ₽</span>
                  </div>
                )}

                <div className="pricing-item total">
                  <strong>Итого:</strong>
                  <strong>{parseFloat(order.total_price).toFixed(2)} ₽</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ErrorComponent error={error} />

      {/* Товары в заказе */}
      <div className="card">
        <div className="card-body">
          <h6 className="card-title">Товары в заказе</h6>
          <div className="order-items">
            {order.items?.map((item, index) => (
              <div key={index} className="order-item row align-items-center py-2 border-bottom">
                <div className="col-md-6">
                  <div className="item-name">{item.product_name}</div>
                  <small className="text-muted">
                    {getUnitDisplay(item.product_unit)}
                  </small>
                </div>
                <div className="col-md-2 text-center">
                  <span className="item-quantity">{parseFloat(item.quantity)}</span>
                </div>
                <div className="col-md-2 text-end">
                  <span className="item-price">{parseFloat(item.price).toFixed(2)} ₽</span>
                </div>
                <div className="col-md-2 text-end">
                  <span className="item-total">{parseFloat(item.total).toFixed(2)} ₽</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
