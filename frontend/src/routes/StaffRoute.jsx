import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { STAFF_ROLES } from '../utils/user';

// Ограничения доступа к станицам для сотрудников и администратора
const StaffRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return STAFF_ROLES.includes(user.role) ? children : <Navigate to="/" />;
}

export default StaffRoute;
