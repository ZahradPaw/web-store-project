import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStaff, deleteUser } from '../../endpoints/api';
import StaffForm from './StaffForm';
import ErrorRetryComponent from '../ErrorRetryComponent';
import LoadingComponent from '../LoadingComponent';
import SearchBar from '../SearchBar';
import { getRoleDisplay } from '../../utils/user';
import './Staff.css'; 

// Компонент списка сотрудников
const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [filter, setFilter] = useState('');
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0); 
  const [error, setError] = useState('');
  const [is_show_form, setShowForm] = useState(false);
  const navigate = useNavigate();
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (isMountedRef.current) return;
    isMountedRef.current = true;
    reloadStaff();
  }, [filter]);

  // Загрузка сотрудников по API
  const loadStaff = async (offset = 0, reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);
    setOffset(offset);
    setError(''); 

    const result = await getStaff(filter, offset);
    
    if (result.success) {
      setStaff(prev => [...prev, ...result.data.results]);
      setCount(result.data.count);
      if (result.data.next) {
        setHasMore(true);
        setOffset(value => value + result.data.results.length);
      }
      else setHasMore(false);
    }
    else setError(result.error);

    setLoading(false);
    setLoadingMore(false); 
  };

  // Перезагрузка всех сотрудников
  const reloadStaff = async () => {
    setStaff([]);
    await loadStaff(0, true);
  }

  // Отображение формы добавления покупателя
  const handleAddStaff = () => {
    setShowForm(true);
  };

  // Перенаправление на страницу редактирования сотрудника
  const handleEditStaff = (staff) => {
    navigate(`/staff/detail/${staff.id}`);
  };

  // Удаление покупателя
  const handleDeleteStaff = async (staff) => {
    if (!window.confirm(
      `Вы уверены, что хотите удалить сотрудника ` +
      `${staff.first_name} ${staff.last_name} - ${getRoleDisplay(staff.role)}?`
    )) {
      return;  
    }

    setLoading(true);
    setError('');
    
    const result = await deleteUser(staff.id);

    if (result.success) {
      await reloadStaff(); 
    }
    else {
      setError(result.error);
    }
    setLoading(false);
  }

  // Обновление каталога при добавлении сотрудника через форму 
  const handleSubmit = async () => {
    setShowForm(false);
    loadStaff();
  }

  // Фильтр поиска сотрудников по имени
  const onSearch = (filter) => {
    isMountedRef.current = false;
    setFilter(filter); 
  }

  const loadingContent = (
    <div>
      <LoadingComponent text={'Загрузка сотрудников...'} />
    </div>
  );

  const errorContent = (
    <div>
      <ErrorRetryComponent 
        error={error}
        onClick={loadStaff}
      />
    </div>
  );

  const notStaffFoundContent = (
    <div className="text-center py-5 empty-state">
      <i className="bi bi-people display-1 text-muted"></i>
      <h3 className="mt-3">Ничего не найдено</h3>
    </div>
  );

  const staffListContent = (
    <div>
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
                  <th>Дата рождения</th>
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
                    <td>{new Date(staffMember.date_of_birth).toLocaleDateString('ru-RU')}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleEditStaff(staffMember)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDeleteStaff(staffMember)}
                        >
                          <i className="bi bi-trash"></i>
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

      {loadingMore && (
        <LoadingComponent text={'Загрузка сотрудников...'} />
      )}

      {!loading && !loadingMore && hasMore && (
        <div className="text-center my-4">
          <button 
            className="btn btn-primary"
            onClick={() => loadStaff(offset)}
          >
            Загрузить еще
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-container">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h2 className="page-title">Сотрудники</h2>
          <p className="text-muted">
            Найдено сотрудников: {count}
          </p>
        </div>
        {!is_show_form &&
          <button
            className="btn btn-primary"
            onClick={handleAddStaff}
          >
            <i className="bi bi-person-plus me-2"></i>
            Добавить сотрудника
          </button>
        }
      </div>

      {is_show_form && <StaffForm 
        onSubmit={handleSubmit} 
        onCancel={() => setShowForm(false)} 
      />}

      <SearchBar onSearch={onSearch} placeholder='Поиск по имени...' />

      {loading ? (loadingContent) : (
        error ? (errorContent) : (
          (filter && staff.length === 0) ? 
            (notStaffFoundContent) : (staffListContent)
        )
      )}
    </div>
  );
};

export default StaffList;
