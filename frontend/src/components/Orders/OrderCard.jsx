import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStatusDisplay, getStatusBadge } from '../../utils/order';
import { formatDate } from '../../utils/utils';
import { getUnitDisplay } from '../../utils/product';
import './Orders.css';

// Компонент карточки заказа
const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const [isExpanded, setExpanded] = useState(false);

  // Перенаправление на страницу заказа при нажатии на карточку
  const handleOrderClick = () => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <div className="order-card card mb-2">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-2" onClick={handleOrderClick}>
            <h5 className="order-number">Заказ #{order.id}</h5>
          </div>

          <div className="col-md-3" onClick={handleOrderClick}>
            <div className="order-total">
              {parseFloat(order.total_price).toFixed(2)} ₽
            </div>
            <small className="text-muted">
              {order.items?.length || 0} товар(ов)
            </small>
          </div>

          <div className="col-md-2" onClick={handleOrderClick}>
            {order.order_date && (
              <div className="delivery-date">
                <small className="text-muted">Дата:</small>
                <div>{formatDate(order.order_date)}</div>
              </div>
            )}
          </div>

          <div className="col-md-2" onClick={handleOrderClick}>
            {order.delivery_date && (
              <div className="delivery-date">
                <small className="text-muted">Доставка:</small>
                <div>{formatDate(order.delivery_date)}</div>
              </div>
            )}
          </div>

          <div className="col-md-2" onClick={handleOrderClick}>
            <span className={getStatusBadge(order.status)}>
              {getStatusDisplay(order.status)}
            </span>
          </div>

          <div className="col-md-1 text-end">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setExpanded(!isExpanded)}
              title={isExpanded ? 'Свернуть товары' : 'Развернуть товары'}
            >
              <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
            </button>
          </div>

        </div>
      </div>
      {isExpanded && order.items && (
        <div className="order-items m-3">
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
      )}
    </div>
  );
};

export default OrderCard;
