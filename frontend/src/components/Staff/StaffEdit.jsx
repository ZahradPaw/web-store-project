import React from 'react';
import { useNavigate } from 'react-router-dom';
import StaffForm from './StaffForm';
import './Staff.css';

// Компонент редактирования покупателя
const StaffEdit = ({ staff }) => {
  const navigate = useNavigate();

  // Отмена редактирования
  const onCancel = () => {
    navigate('/staff/list'); 
  }

  return (
    <div className="sales-form-container">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="bi bi-person-plus me-2"></i>
          Редактирование сотрудника
        </h5>
      </div>
      <StaffForm staff={staff} onCancel={onCancel} />
    </div>
  );
};

export default StaffEdit;
