import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm';

// Страница формы регистрации (сделать)
const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
