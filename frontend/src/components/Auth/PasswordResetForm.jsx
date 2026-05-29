import React, { useState } from 'react';
import ErrorComponent from '../ErrorComponent';
import { passwordReset } from '../../endpoints/api';
import './Auth.css';

// Компонент формы восстановления пароля по почте
const PasswordResetForm = ({ onSuccess }) => {
  const [credentials, setCredentials] = useState({
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Отправка формы входа
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const result = await passwordReset(credentials);

    if (result.success) {
      onSuccess?.();
    }
    else {
      setError(result.error);
    }
    setLoading(false);
  }

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
            <h2 className="card-title text-center mb-4">Восстановление пароля</h2>

            <ErrorComponent error={error} />

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Адрес электронной почты
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
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
                    Отправка...
                  </div>
                ) : (
                  'Отправить'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetForm; 
