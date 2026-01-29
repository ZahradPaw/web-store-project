import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderEdit from '../components/Orders/OrderEdit';
import LoadingComponent from '../components/LoadingComponent';
import ErrorRetryComponent from '../components/ErrorRetryComponent';
import { getOrder } from '../endpoints/api';
import usePageTitle from '../hooks/usePageTitle';

// Страница редактирования заказа для продавца
const OrderEditPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  usePageTitle(`Редактирование заказа #${id}`);

  useEffect(() => {
    loadOrder();
  }, [id]);

  // Загрузка товара
  const loadOrder = async () => {
    setLoading(true);
    setError(''); 
    
    const result = await getOrder(id);

    if (result.success) {
      setOrder(result.data)
    }
    else {
      setError(result.error);
    }
    setLoading(false);
  } 

  // Контент при загрузке
  if (loading) {
   return (
      <div className="container py-4">
        <LoadingComponent text={'Загрузка заказа...'} />
      </div>
    );
  }

  // Контент при ошибке
  if (error) {
    return (
      <div className="container py-4">
        <ErrorRetryComponent 
          error={error}
          onClick={loadOrder}
        />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate('/orders/list')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Назад к списку заказов
          </button>
        </div>
      </div>

      <OrderEdit order={order} />
    </div>
  );
};

export default OrderEditPage;
