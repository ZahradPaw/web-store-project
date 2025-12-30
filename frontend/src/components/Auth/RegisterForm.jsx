import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../endpoints/api';
import { createDefaultUser } from '../../utils/user';
import ErrorComponent from '../ErrorComponent';
import './Auth.css';

// Форма регистрации клиентов для неавторизованных
const RegisterForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(createDefaultUser());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Очищаем ошибку для поля при изменении
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Проверка формы
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Имя пользователя должно быть не менее 3 символов';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен быть не менее 8 символов';
    }
    
    if (formData.password !== formData.password2) {
      newErrors.password2 = 'Пароли не совпадают';
    }
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Имя обязательно';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Фамилия обязательна';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});

    const result = await register(formData);

    if (result.success) {
      setRegistrationSuccess(true);

      // Автоматический вход после успешной регистрации
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            registrationSuccess: true,
            message: 'Регистрация прошла успешно! Теперь вы можете войти.' 
          }
        });
      }, 3000);
    } 
    else {
      setErrors({ submit: result.error });
    }
    setLoading(false);
  };

  if (registrationSuccess) {
    return (
      <div className="register-container">
        <div className="register-success">
          <div className="success-icon">✓</div>
          <h2>Регистрация успешна!</h2>
          <p>Вы успешно зарегистрировались как покупатель.</p>
          <p>Через несколько секунд вы будете перенаправлены на страницу входа...</p>
          <Link to="/login" className="success-link">
            Перейти к входу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Регистрация</h2>
          <p>Создайте аккаунт для совершения покупок онлайн</p>
        </div>
        
        <ErrorComponent error={errors.submit} />
        
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="first_name">Имя *</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={errors.first_name ? 'error' : ''}
              placeholder="Введите ваше имя"
            />
            {errors.first_name && (
              <span className="error-message">{errors.first_name}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="last_name">Фамилия *</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={errors.last_name ? 'error' : ''}
              placeholder="Введите вашу фамилию"
            />
            {errors.last_name && (
              <span className="error-message">{errors.last_name}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Имя пользователя *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="Придумайте имя пользователя"
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
            <small className="form-text">Будет использоваться для входа в систему</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Введите ваш email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
            <small className="form-text">На этот email будут приходить уведомления о заказах</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Телефон *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              placeholder="+7 (999) 123-45-67"
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
            <small className="form-text">Для связи по поводу доставки</small>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Дата рождения</label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className={errors.date_of_birth ? 'error' : ''}
            />
            {errors.date_of_birth && (
              <span className="error-message">{errors.date_of_birth}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Придумайте пароль"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password2">Подтверждение пароля *</label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className={errors.password2 ? 'error' : ''}
              placeholder="Повторите пароль"
            />
            {errors.password2 && (
              <span className="error-message">{errors.password2}</span>
            )}
          </div>
            
          <button 
            type="submit" 
            className="btn-register"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Регистрация...
              </>
            ) : 'Зарегистрироваться'}
          </button>
        </form>
        
        <div className="text-center mt-3">
          <small className="text-muted">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
