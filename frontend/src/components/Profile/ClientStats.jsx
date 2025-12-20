import React, { useState, useEffect } from 'react';
import LoadingComponent from '../LoadingComponent';
import ErrorRetryComponent from '../ErrorRetryComponent';
import { getLoyaltySettings } from '../../endpoints/api';
import './Profile.css';

// Компнент статистики клиента
const ClientStats = ({ user }) => {
  const [regular_discount, setDiscount] = useState(0);
  const [regular_threshold, setThreshold] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLoyaltySettings();
  }, []);

  // Загрузка скидки для постоянных клиентов
  const loadLoyaltySettings = async () => {
    setLoading(true);
    setError(''); 

    const result = await getLoyaltySettings();

    if (result.success) {
      setDiscount(result.data.regular_discount);
      setThreshold(result.data.regular_threshold);
    }
    else {
      setError(result.error);
    }
    setLoading(false);
  };

  // Контент при загрузке
  if (loading) {
    return (
      <div>
        <LoadingComponent text={'Загрузка параметров лояльности...'} />
      </div>
    );
  }

  // Контент при ошибке 
  if (error) {
    return (
      <div>
        <ErrorRetryComponent 
          error={error}
          onClick={loadLoyaltySettings}
        />
      </div>
    );
  }

  return (
    <div className="card stats-card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="bi bi-graph-up me-2"></i>
          Статистика покупок
        </h5>
      </div>
      <div className="card-body">
        <div className="row text-center">
          <div className="col-md-6 mb-3">
            <div className="stat-item">
              <div className="stat-value text-primary">
                {user.total_spent} ₽
              </div>
              <div className="stat-label">Общая сумма заказов</div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="stat-item">
              <div className="stat-value">
                {user.is_regular ? (
                  <span className="text-success">
                    <i className="bi bi-star-fill me-1"></i>
                    Постоянный
                  </span>
                ) : (
                  <span className="text-secondary">
                    Не постоянный клиент
                  </span>
                )}
              </div>
              <div className="stat-label">Статус клиента</div>
            </div>
          </div>
        </div>

        {!user.is_regular && user.total_spent > 0 && (
          <div className="alert alert-info mt-3">
            <div className="d-flex align-items-center">
              <i className="bi bi-info-circle me-2"></i>
              <div>
                <strong>Станьте постоянным клиентом!</strong>
                <div className="small">
                  Закажите ещё товаров на {parseFloat(regular_threshold - user.total_spent).toFixed()} ₽
                  для получения скидки {parseFloat(regular_discount).toFixed()}% на все заказы!
                </div>
              </div>
            </div>
          </div>
        )}

        {user.is_regular && (
          <div className="alert alert-success mt-3">
            <div className="d-flex align-items-center">
              <i className="bi bi-star-fill me-2"></i>
              <div>
                <strong>Вы постоянный клиент!</strong>
                <div className="small">
                  Вам доступна скидка {parseFloat(regular_discount).toFixed()}% на все заказы!
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientStats;
