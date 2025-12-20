import React, { useState, useEffect } from 'react';
import LoadingComponent from '../LoadingComponent';
import ErrorComponent from '../ErrorComponent';
import ErrorRetryComponent from '../ErrorRetryComponent';
import { getLoyaltySettings, 
  updateLoyaltySettings } from '../../endpoints/api';
import './LoyaltySettings.css'; 

// Компонент настроек лояльности 
const LoyaltySettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    regular_threshold: '',
    regular_discount: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  // Загрузка настроек лояльности
  const loadSettings = async () => {
    setLoading(true);
    setError(''); 
    setSuccess(''); 

    const result = await getLoyaltySettings();

    if (result.success) {
      setSettings(result.data);
      setFormData({
        regular_threshold: result.data.regular_threshold || '',
        regular_discount: result.data.regular_discount || ''
      });
    }
    else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обновление настоек лояльности
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const result = await updateLoyaltySettings(formData);

    if (result.success) {
      setSettings(result.data);
      setSuccess('Настройки лояльности успешно обновлены!');
    }
    else {
      setError(result.error);
    }
    setSaving(false);
  };

  // Контент при загрузке
  if (loading) {
   return (
      <div>
        <LoadingComponent text={'Загрузка настроек лояльности...'} />
      </div>
    );
  }

  // Контент при ошибке
  if (error) {
    return (
      <div>
        <ErrorRetryComponent 
          error={error}
          onClick={loadSettings}
        />
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="row">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">
              <i className="bi bi-gift me-2"></i>
              Настройки программы лояльности
            </h5>
          </div>
          <div className="card-body">
            
            <ErrorComponent error={error} />

            {success && (
              <div className="alert alert-success">
                <i className="bi bi-check-circle me-2"></i>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <label htmlFor="regular_threshold" className="form-label">
                    Порог для постоянного клиента (₽) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    id="regular_threshold"
                    name="regular_threshold"
                    value={formData.regular_threshold}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                  <div className="form-text">
                    Сумма покупок, после которой клиент становится постоянным
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <label htmlFor="regular_discount" className="form-label">
                    Скидка для постоянных клиентов (%) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    className="form-control"
                    id="regular_discount"
                    name="regular_discount"
                    value={formData.regular_discount}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                  <div className="form-text">
                    Процент скидки, который получают постоянные клиенты
                  </div>
                </div>
              </div>
              <div className="current-settings mb-4">
                <h6>Текущие настройки:</h6>
                <div className="settings-info">
                  <div className="info-item">
                    <span className="label">Порог постоянного клиента:</span>
                    <span className="value">
                      {parseFloat(settings?.regular_threshold || 0).toFixed(2)} ₽
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Скидка постоянным клиентам:</span>
                    <span className="value">
                      {parseFloat(settings?.regular_discount || 0).toFixed(2)} %
                    </span>
                  </div>
                </div>
              </div>
              <div className="loyalty-explanation mb-4">
                <div className="alert alert-info">
                  <h6 className="alert-heading">
                    <i className="bi bi-info-circle me-2"></i>
                    Как работает программа лояльности:
                  </h6>
                  <ul className="mb-0">
                    <li>Клиенты становятся постоянными при достижении указанной суммы покупок</li>
                    <li>Постоянные клиенты получают указанную скидку на все последующие заказы</li>
                    <li>Статус постоянного клиента присваивается автоматически</li>
                    <li>Скидка применяется автоматически при оформлении заказа</li>
                  </ul>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Сохранить настройки
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={loadSettings}
                  disabled={saving}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Обновить
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltySettings;
