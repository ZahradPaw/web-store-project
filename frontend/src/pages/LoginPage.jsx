import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';

// Страница входа
const LoginPage = () => {
  const navigate = useNavigate();

  // Переход при успешном входе на главную
  const handleLoginSuccess = () => {
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="container">
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}

export default LoginPage; 
