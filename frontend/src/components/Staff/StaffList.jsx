import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../../endpoints/api';
import ErrorComponent from '../ErrorComponent';
import LoadingComponent from '../LoadingComponent';
import './Staff.css'; 

// Компонент списка сотрудников
const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadStaff();
  }, []);

  // Загрузка сотрудников по API
  const loadStaff = async () => {
    setLoading(true);
    setError('');

    const result = await getUsers();
    
    if (result.success) {
      // Фильтрация сотрудников
      const staffData = result.data.results.filter(
        user => user.role != 'client');
      setStaff(staffData);
    }
    else 
      setError(result.error);
    setLoading(false);
  };

  // Перенаправление на страницу добавления нового сотрудника
  const handleAddStaff = () => {
    navigate('/staff/register');
  };

  // Перенаправление на страницу редактирования сотрудника
  const handleEditStaff = (staff) => {
    navigate(`/staff/detail/${staff.id}`);
  };

  // Отображение роли пользователя
  const getRoleDisplay = (role) => {
    const roles = {
      'admin': 'Администратор',
      'merchandiser': 'Товаровед',
      'account_manager': 'Клиент-менеджер',
      'salesperson': 'Продавец'
    };
    return roles[role] || role;
  };

  // Контент при загрузке
  if (loading) {
   return (
      <div className="container py-4">
        <LoadingComponent text={'Загрузка сотрудников...'} />
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="page-title">Сотрудники</h2>
          <p className="text-muted">
            Всего сотрудников: {staff.length}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleAddStaff}
        >
          <i className="bi bi-person-plus me-2"></i>
          Добавить сотрудника
        </button>
      </div>

      <ErrorComponent error={error} />

      {staff.length === 0 ? (
        <div className="text-center py-5 empty-state">
          <i className="bi bi-person-badge display-1 text-muted"></i>
          <h3 className="mt-3">Сотрудники отсутствуют</h3>
          <p className="text-muted">Добавьте первого сотрудника</p>
          <button
            className="btn btn-primary"
            onClick={handleAddStaff}
          >
            <i className="bi bi-person-plus me-2"></i>
            Добавить сотрудника
          </button>
        </div>
      ) : (
        <div className="staff-table-container">
          <div className="table-responsive">
            <table className="table table-hover staff-table">
              <thead className="table-dark">
                <tr>
                  <th>ФИО</th>
                  <th>Логин</th>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>Телефон</th>
                  <th>Дата регистрации</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(staffMember => (
                  <tr key={staffMember.id} className="staff-row">
                    <td>
                      <div className="staff-name">
                        {staffMember.first_name} {staffMember.last_name}
                      </div>
                    </td>
                    <td>{staffMember.username}</td>
                    <td>{staffMember.email}</td>
                    <td>
                      <span className={`role-badge role-${staffMember.role}`}>
                        {getRoleDisplay(staffMember.role)}
                      </span>
                    </td>
                    <td>{staffMember.phone || 'Не указан'}</td>
                    <td>{new Date(staffMember.date_joined).toLocaleDateString('ru-RU')}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleEditStaff(staffMember)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffList;
