import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerForm from '../components/Customers/CustomerForm';

// Страница регистрации нового сотрудника
const CustomerCreatePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      <div className="row mb-2">
        <div className="col-12">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate('/customers/list')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Назад к списку покупателей
          </button>
        </div>
      </div>

      <CustomerForm />
    </div>
  );
};

export default CustomerCreatePage;
