import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorComponent from '../ErrorComponent';
import { register, updateUser, deleteUser } from '../../endpoints/api';
import { ROLES, createDefaultUser } from '../../utils/user';
import './Staff.css'; 

// Форма добавления и редактирования сотрудника
const StaffForm = ({ staff, onSubmit, onCancel }) => {
  // Если параметром передан staff, то осуществляется редактирование данного сотрудника
  // В ином случае идет добавление нового сотрудника

  const [formData, setFormData] = useState(createDefaultUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (staff) {
      setFormData({
        username: staff.username || '',
        email: staff.email || '',
        first_name: staff.first_name || '',
        last_name: staff.last_name || '',
        phone: staff.phone || '',
        role: staff.role || ROLES.SALESPERSON,
        date_of_birth: staff.date_of_birth || ''
      });
    }
  }, [staff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очистка ошибок при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

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

    if (!staff && !formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (!staff && formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (!staff && formData.password !== formData.password2) {
      newErrors.password2 = 'Пароли не совпадают';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Имя обязательно';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Фамилия обязательна';
    }

    if (!formData.date_of_birth.trim()) {
      newErrors.last_name = 'Дата рождения обязательна';
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

      if (staff) {
        await updateCurrentStaff();
      } 
      else {
        await createNewStaff(); 
      }
      setLoading(false);
    }
  };

  // Добавление нового сотрудника
  const createNewStaff = async () => {
    const result = await register(formData);

    if (result.success) {
      // Перенаправление на страницу со списком сотрудников
      navigate('/staff/list');
    }
    else {
      setError(result.error);
    }
  } 

  // Обновление текущего сотрудника
  const updateCurrentStaff = async () => {
    const result = await updateUser(staff.id, formData);

    if (result.success) {
      // Перенаправление на страницу со списком сотрудников
      navigate('/staff/list');
    }
    else {
      setError(result.error);
    }
  }

  // Удаление текущего сотрудника
  const deleteStaff = async () => {
    setLoading(true);
    setError('');
    
    const result = await deleteUser(staff.id);

    if (result.success) {
      // Перенаправление на страницу со списком сотрудников
      navigate('/staff/list');
    }
    else {
      setError(result.error);
    }
    setLoading(false);
  }

  // Функция кнопки удаления сотрудника
  const onDelete = async () => {
    if (window.confirm(
      `Вы уверены, что хотите удалить сотрудника ${staff.first_name} ${staff.last_name}?`
    )) {
      await deleteStaff();  
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
              
              {!staff && (
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
                  Телефон
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
              </div>

              <div className="mb-2">
                <label htmlFor="role" className="form-label">
                  Роль *
                </label>
                <select
                  className="form-select"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="salesperson">Продавец</option>
                  <option value="merchandiser">Товаровед</option>
                  <option value="account_manager">Клиент-менеджер</option>
                  <option value="director">Директор</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>

              <div className="mb-2">
                <label htmlFor="date_of_birth" className="form-label">
                  Дата рождения *
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  placeholder="12.12.2000"
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Сохранение...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    {staff ? 'Сохранить изменения' : 'Добавить сотрудника'}
                  </>
                )}
              </button>
              {staff && (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={onDelete}
                >
                  <i className="bi bi-trash me-2"></i>
                  Удалить сотрудника
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

export default StaffForm;
