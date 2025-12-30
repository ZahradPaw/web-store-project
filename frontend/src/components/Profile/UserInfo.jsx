import React from 'react';
import { getRoleDisplay } from '../../utils/user';
import { formatDate } from '../../utils/utils';
import './Profile.css';

// Компонент с информацией о пользователе
const UserInfo = ({ user }) => {
  return (
    <div className="card user-info-card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="bi bi-person-circle me-2"></i>
          Личная информация
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="info-group">
              <label className="info-label">Логин:</label>
              <span className="info-value">{user.username}</span>
            </div>
            <div className="info-group">
              <label className="info-label">Email:</label>
              <span className="info-value">{user.email || 'Не указан'}</span>
            </div>
            <div className="info-group">
              <label className="info-label">Телефон:</label>
              <span className="info-value">{user.phone || 'Не указан'}</span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="info-group">
              <label className="info-label">Имя:</label>
              <span className="info-value">{user.first_name || 'Не указано'}</span>
            </div>
            <div className="info-group">
              <label className="info-label">Фамилия:</label>
              <span className="info-value">{user.last_name || 'Не указана'}</span>
            </div>
            <div className="info-group">
              <label className="info-label">Дата рождения:</label>
              <span className="info-value">{formatDate(user.date_of_birth)}</span>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-12">
            <div className="info-group">
              <label className="info-label">Роль:</label>
              <span className="info-value">
                <span className={`role-badge role-${user.role}`}>
                  {getRoleDisplay(user.role)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
