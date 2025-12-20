import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import ErrorComponent from '../ErrorComponent';
import './Auth.css';

// Компонент формы входа
const LoginForm = ({ onSuccess }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { userLogin } = useAuthContext();

  // Отправка формы входа
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const result = await userLogin(credentials);

    if (result.success)
      onSuccess?.();
    else
      setError(result.error);
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
      <div className="col-md-6 col-lg-4">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="card-title text-center mb-4">Вход</h2>

            <ErrorComponent error={error} />

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Логин
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Пароль
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={credentials.password}
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
                    Вход...
                  </div>
                ) : (
                  'Войти'
                )}
              </button>
            </form>

            <div className="text-center mt-3">
              <small className="text-muted">
                Нет аккаунта? <Link to="/register">Зарегестрируйтесь!</Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm; 
