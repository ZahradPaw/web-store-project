import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import PasswordResetConfirmForm from '../components/Auth/PasswordResetConfirmForm';
import usePageTitle from '../hooks/usePageTitle';
import LoadingComponent from '../components/LoadingComponent';
import { passwordResetValidateToken } from '../endpoints/api';

// Страница введения нового пароля при восстановлении
const PasswordResetConfirmPage = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  usePageTitle("Введите новый пароль");

  // Переход при успешной установке нового пароля
  const handleLoginSuccess = () => {
    navigate('/password-reset/complete');
  };

  useEffect(() => {
    validateToken();
  }, [token]);

  // Проверка токена для восстановления пароля
  const validateToken = async () => {
    setLoading(true);
    setError(''); 
    
    const result = await passwordResetValidateToken({ token: token });

    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  } 

  // Контент при загрузке
  if (loading) {
   return (
      <div className="container py-4">
        <LoadingComponent text={'Загрузка...'} />
      </div>
    );
  }

  // Контент при ошибке
  if (error) {
    return (
      <div className="container mt-5">
        <h2 className="mb-4">❌ Ошибка восстановления пароля!</h2>
        <p>
            Похоже, что данная ссылка для восстановления пароля устарела или недействительна.
        </p>
        <p>
            <Link to="/password-reset">Попробуйте запросить новую ссылку.</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="container">
        <PasswordResetConfirmForm onSuccess={handleLoginSuccess} token={token} />
      </div>
    </div>
  );
}

export default PasswordResetConfirmPage; 
