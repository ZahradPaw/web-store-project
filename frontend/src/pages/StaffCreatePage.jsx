import React from 'react';
import { useNavigate } from 'react-router-dom';
import StaffForm from '../components/Staff/StaffForm';

// Страница регистрации нового сотрудника
const StaffCreatePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate('/staff/list')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Назад к списку сотрудников
          </button>
        </div>
      </div>

      <StaffForm />
    </div>
  );
};

export default StaffCreatePage;
