import React from 'react';
import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

// Страница уведомления, что пароль был успешно изменен при восстановлении
const PasswordResetCompletePage = () => {
  usePageTitle("Пароль успешно изменен");

  return (
      <div className="container mt-5">
        <h2 className="mb-4">✅ Пароль успешно изменен!</h2>
        <p>
            Поздравляем, вы успешно изменили пароль своего аккаунта! 
            Используйте его для <Link to="/login">входа в систему.</Link>
        </p>
      </div>
  );
}

export default PasswordResetCompletePage; 
