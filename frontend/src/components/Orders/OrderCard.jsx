import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

// Компонент карточки заказа
const OrderCard = ({ order }) => {
  const navigate = useNavigate();

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

  // Локализация дат
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  // Перенаправление на страницу заказа при нажатии на карточку
  const handleOrderClick = () => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <div className="order-card card mb-3" onClick={handleOrderClick}>
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-3">
            <h6 className="order-number">Заказ #{order.id}</h6>
            <small className="text-muted">
              {formatDate(order.order_date)}
            </small>
          </div>

          <div className="col-md-2">
            <div className="order-total">
              {parseFloat(order.total_price).toFixed(2)} ₽
            </div>
            <small className="text-muted">
              {order.items?.length || 0} товар(ов)
            </small>
          </div>

          <div className="col-md-3">
            {order.delivery_date && (
              <div className="delivery-date">
                <small className="text-muted">Доставка:</small>
                <div>{formatDate(order.delivery_date)}</div>
              </div>
            )}
          </div>

          <div className="col-md-2">
            <span className={getStatusBadge(order.status)}>
              {getStatusText(order.status)}
            </span>
          </div>

          <div className="col-md-2 text-end">
            <div className="mt-2">
              <i className="bi bi-chevron-right text-muted"></i>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderCard;
