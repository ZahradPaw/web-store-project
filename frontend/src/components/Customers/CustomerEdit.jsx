import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerForm from './CustomerForm';
import './Customers.css';

// Компонент редактирования покупателя
const CustomerEdit = ({ customer }) => {
  const navigate = useNavigate();

  // Отмена редактирования
  const onCancel = () => {
    navigate('/customers/list'); 
  }

  return (
    <div className="sales-form-container">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="bi bi-person-plus me-2"></i>
          Редактирование покупателя
        </h5>
      </div>
      <CustomerForm customer={customer} onCancel={onCancel} />
    </div>
  );
};

export default CustomerEdit;
