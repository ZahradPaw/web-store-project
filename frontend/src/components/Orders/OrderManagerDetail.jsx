import React, { useState } from 'react';
import ErrorComponent from '../ErrorComponent';
import { updateOrder, markOrderPaid, markOrderDelivered, cancelOrder } from '../../endpoints/api';
import './Orders.css';

// Компонент деталей заказа для продавца
const OrderManagerDetail = ({ order }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    status: order.status,
    delivery_date: order.delivery_date || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Сохранение изменения заказа
  const handleSave = async () => {
    setLoading(true);
    setError('');

    // Изменение даты доставки заказа
    const resultDataUpdate = await updateOrder(order.id, formData);

    // Изменение статуса заказа
    let resultUpdateStatus;
    console.log(formData.status);
    if (formData.status == 'paid') {
      resultUpdateStatus = await markOrderPaid(order.id);
    }
    else if (formData.status == 'delivered') {
      resultUpdateStatus = await markOrderDelivered(order.id);
    }
    else if (formData.status == 'cancelled') {
      resultUpdateStatus = await cancelOrder(order.id); 
    }

    if (resultDataUpdate.success && resultUpdateStatus?.success) {
      setEditing(false);
    }
    else {
      setError(resultDataUpdate.error);
    }
    setLoading(false);
  }

  // Отмента редактирования
  const handleCancel = () => {
    setFormData({
      status: order.status,
      delivery_date: order.delivery_date || ''
    });
    setEditing(false);
    setError('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указана';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getUnitDisplay = (unit) => {
    const units = {
      'pieces': 'шт',
      'kg': 'кг',
      'liter': 'л'
    };
    return units[unit] || unit;
  };

  // Статус заказа
  const getStatusBadge = (status) => {
    const statusConfig = {
      'created': 'warning',
      'paid': 'info',
      'delivered': 'success',
      'cancelled': 'danger'
    };
    return `badge bg-${statusConfig[status] || 'secondary'}`;
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

  return (
    <div className="sales-order-detail">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Заказ #{order.id}</h5>
        </div>
        <div className="card-body">
          <ErrorComponent error={error} />

          <div className="row mb-4">
            <div className="col-md-6">
              <h6>Информация о заказе</h6>
              <div className="order-info">
                <div className="info-item">
                  <span className="label">Покупатель:</span>
                  <span className="value">{order.client_name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Дата создания:</span>
                  <span className="value">{formatDate(order.order_date)}</span>
                </div>
              </div>
              <div className="order-pricing">
                <div className="info-item">
                  <h6>Сумма заказа:</h6>
                  <span>{parseFloat(order.total_price).toFixed(2)} ₽</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="info-item text-success">
                    <span>Скидка:</span>
                    <span>-{parseFloat(order.discount_amount).toFixed(2)} ₽</span>
                  </div>
                )}
                <div className="pricing-item total">
                  <strong>Итого:</strong>
                  <strong>{parseFloat(order.total_price).toFixed(2)} ₽</strong>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <h6>Управление заказом</h6>
              <div className="order-management">
                {!editing ? (
                  <div className="current-settings">
                    <div className="info-item">
                      <span className="label">Статус:</span>
                      <span className={getStatusBadge(order.status)}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Доставка:</span>
                      <span className="value">{formatDate(order.delivery_date)}</span>
                    </div>
                    <button
                      className="btn btn-outline-primary btn-sm mt-2"
                      onClick={() => setEditing(true)}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Редактировать
                    </button>
                  </div>
                ) : (
                  <div className="edit-settings">
                    <div className="mb-3">
                      <label className="form-label">Статус</label>
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="paid">Оплачен</option>
                        <option value="delivered">Доставлен</option>
                        <option value="cancelled">Отменен</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Дата доставки</label>
                      <input
                        type="date"
                        className="form-control"
                        name="delivery_date"
                        value={formData.delivery_date}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handleSave}
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="spinner-border spinner-border-sm me-2"></span>
                        ) : (
                          <i className="bi bi-check me-2"></i>
                        )}
                        Сохранить
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <h6 className="mt-4">Товары в заказе</h6>
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
                  <span className="item-quantity">{item.quantity}</span>
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

export default OrderManagerDetail;
