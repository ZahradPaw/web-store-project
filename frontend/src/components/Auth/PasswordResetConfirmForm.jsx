import React, { useState } from 'react';
import { passwordResetConfirm } from '../../endpoints/api';
import ErrorComponent from '../ErrorComponent';
import './Auth.css';

// Компонент формы установки нового пароля при его восстановлении
const PasswordResetConfirmForm = ({ onSuccess, token }) => {
  const [credentials, setCredentials] = useState({
    token: token,
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Отправка формы входа
  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const result = await passwordResetConfirm(credentials);

    if (result.success) {
      onSuccess?.();
    }
    else {
      setErrors({ submit: result.error });
    }
    setLoading(false);
  }

  // Проверка формы
  const validateForm = () => {
    const newErrors = {};

    if (!credentials.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (credentials.password.length < 8) {
      newErrors.password = 'Пароль должен быть не менее 8 символов';
    }
    if (credentials.password !== credentials.password2) {
      newErrors.password2 = 'Пароли не совпадают';
    }

    return newErrors;
  };

  // Обновление данных при вводе
  const handleChange = (event) => {
    setCredentials({
      ...credentials,
      [event.target.name]: event.target.value
    });
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="card-title text-center mb-4">Новый пароль</h2>

            <ErrorComponent error={errors.submit} />

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Новый пароль
                </label>
                <input
                  type="password"
                  className={errors.password ? 'error' : ''}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password2" className="form-label">
                  Повторите пароль
                </label>
                <input
                  type="password"
                  className={errors.password2 ? 'error' : ''}
                  id="password2"
                  name="password2"
                  value={credentials.password2}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                {errors.password2 && (
                  <span className="error-message">{errors.password2}</span>
                )}
              </div>

              <button
                type="submit"
                className="login-button btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <div>
                    <span className="spinner-border spinner-border-sm me-2"
                      role="status"></span>
                    Сохранение...
                  </div>
                ) : (
                  'Сохранить'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetConfirmForm; 
