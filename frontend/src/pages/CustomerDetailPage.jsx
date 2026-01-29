import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerDetail from '../components/Customers/CustomerDetail';
import LoadingComponent from '../components/LoadingComponent';
import ErrorRetryComponent from '../components/ErrorRetryComponent';
import { getUser } from '../endpoints/api';
import usePageTitle from '../hooks/usePageTitle';

// Страница с информацией о покупателе и его заказах
const CustomerDetailPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  usePageTitle(customer && `Покупатель: ${customer.first_name} ${customer.last_name}`);

  useEffect(() => {
    loadCustomer();
  }, [id]);

  // Загрузка данных клиента
  const loadCustomer = async () => {
    setLoading(true);
    setError(''); 
    
    const result = await getUser(id);

    if (result.success) {
      setCustomer(result.data)
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
        <LoadingComponent text={'Загрузка данных клиента...'} />
      </div>
    );
  }

  // Контент при ошибке
  if (error) {
    return (
      <div className="container py-4">
        <ErrorRetryComponent 
          error={error}
          onClick={loadCustomer}
        />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-2">
        <div className="col-12">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate('/customers/list')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Назад к списку клиентов
          </button>
        </div>
      </div>

      <CustomerDetail customer={customer} />
    </div>
  );
};

export default CustomerDetailPage;
