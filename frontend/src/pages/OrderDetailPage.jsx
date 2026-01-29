import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderDetail from '../components/Orders/OrderDetail';
import usePageTitle from '../hooks/usePageTitle';

// Страница просмотра заказа для клиента
const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  usePageTitle(`Заказ #${id}`);

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate('/orders')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Назад к списку заказов
          </button>
        </div>
      </div>

      <OrderDetail order_id={id} />
    </div>
  );
};

export default OrderDetailPage;
