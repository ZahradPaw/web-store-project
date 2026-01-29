import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorComponent from '../ErrorComponent';
import { register, updateUser, deleteUser } from '../../endpoints/api';
import { createDefaultUser } from '../../utils/user';
import './Customers.css';

// Форма добавления и редактирования покупателя
const CustomerForm = ({ customer, onSubmit, onCancel }) => {
  // Если параметром передан customer, то осуществляется редактирование данных покупателя
  // В ином случае идет добавление нового покупателя

  const [formData, setFormData] = useState(createDefaultUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (customer) {
      setFormData({
        username: customer.username || '',
        email: customer.email || '',
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        phone: customer.phone || '',
        date_of_birth: customer.date_of_birth || ''
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очистка ошибки при изменении
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Логин обязателен';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!customer && !formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (!customer && formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (!customer && formData.password !== formData.password2) {
      newErrors.password2 = 'Пароли не совпадают';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Имя обязательно';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Фамилия обязательна';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Номер телефона обязателен';
    }

    if (!formData.date_of_birth.trim()) {
      newErrors.date_of_birth = 'Дата рождения обязательна';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (validateForm()) {

      setLoading(true);
      setError('');
      setErrors({}); 

      if (customer) {
        await updateCurrentCustomer();
      } 
      else {
        await createNewCustomer(); 
      }
      setLoading(false);
      if (onSubmit) onSubmit();
    }
  };

  // Добавление нового покупателя
  const createNewCustomer = async () => {
    const result = await register(formData);
  
    if (result.success) {
      // Перенаправление на страницу со списком покупателей
      navigate('/customers/list');
    }
    else {
      setError(result.error);
    }
  } 
  
  // Обновление текущего покупателя
  const updateCurrentCustomer = async () => {
    const result = await updateUser(customer.id, formData);
  
    if (result.success) {
      // Перенаправление на страницу со списком покупателей
      navigate('/customers/list');
    }
    else {
      setError(result.error);
    }
  }
  
  // Удаление текущего покупателя
  const deleteCustomer = async () => {
    setLoading(true);
    setError('');
      
    const result = await deleteUser(customer.id);
  
    if (result.success) {
      // Перенаправление на страницу со списком покупателей
      navigate('/customers/list');
    }
    else {
      setError(result.error);
    }
    setLoading(false);
  }

  // Функция кнопки удаления покупателя
  const onDelete = async () => {
    if (window.confirm(
      `Вы уверены, что хотите удалить покупателя ${customer.first_name} ${customer.last_name}?`
    )) {
      await deleteCustomer();  
    }
  }

  return (
    <div className="card mb-3">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <ErrorComponent error={error} />
          <div className="row">
            <div className="mb-2">
              <label htmlFor="username" className="form-label">
                Логин *
              </label>
              <input
                type="text"
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Введите логин"
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>

            {!customer && (
              <div>
                <div className="mb-2">
                  <label htmlFor="password" className="form-label">
                    Пароль *
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Минимум 6 символов"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <div className="mb-2">
                  <label htmlFor="password2" className="form-label">
                    Подтверждение пароля *
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.password2 ? 'is-invalid' : ''}`}
                    id="password2"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    placeholder="Повторите пароль"
                  />
                  {errors.password2 && (
                    <div className="invalid-feedback">{errors.password2}</div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mb-2">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="first_name" className="form-label">
                Имя *
              </label>
              <input
                type="text"
                className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Введите имя"
              />
              {errors.first_name && (
                <div className="invalid-feedback">{errors.first_name}</div>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="last_name" className="form-label">
                Фамилия *
              </label>
              <input
                type="text"
                className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Введите фамилию"
              />
              {errors.last_name && (
                <div className="invalid-feedback">{errors.last_name}</div>
              )}
            </div>
            
            <div className="mb-2">
              <label htmlFor="phone" className="form-label">
                Телефон *
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+7 (999) 999-99-99"
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="date_of_birth" className="form-label">
                Дата рождения *
              </label>
              <input
                type="date"
                className="form-control"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.date_of_birth}</div>
              )}
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  {customer ? 'Сохранение...' : 'Создание...'}
                </div>
              ) : (
                <div>
                  <i className="bi bi-check-circle me-2"></i>
                  {customer ? 'Сохранить изменения' : 'Добавить покупателя'}
                </div>
              )}
            </button>
            {customer && (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={onDelete}
              >
                <i className="bi bi-trash me-2"></i>
                Удалить покупателя
              </button>
            )}
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              <i className="bi bi-x-circle me-2"></i>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
