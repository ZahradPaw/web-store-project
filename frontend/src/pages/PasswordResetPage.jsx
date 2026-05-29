import React from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordResetForm from '../components/Auth/PasswordResetForm';
import usePageTitle from '../hooks/usePageTitle';

// Страница восстановления пароля по почте
const PasswordResetPage = () => {
  const navigate = useNavigate();

  usePageTitle("Восстановления пароля");

  // Переход при успешном вводе почты
  const handleLoginSuccess = () => {
    navigate('/password-reset/done');
  };

  return (
    <div className="login-page">
      <div className="container">
        <PasswordResetForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}

export default PasswordResetPage; 
