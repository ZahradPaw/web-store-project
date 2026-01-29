import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm';
import usePageTitle from '../hooks/usePageTitle';

// Страница формы регистрации 
const RegisterPage = () => {
  usePageTitle("Регистрация");

  return (
    <div className="container">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
