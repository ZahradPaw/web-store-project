import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../../endpoints/api';
import ErrorRetryComponent from '../ErrorRetryComponent';
import LoadingComponent from '../LoadingComponent';
import SearchBar from '../SearchBar';
import { formatDate } from '../../utils/utils';
import CustomerForm from './CustomerForm';
import './Customers.css';

// Компонент списка клиентов
const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
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
    reloadCustomers();
  }, [filter]);

  // Загрузка клиентов по API
  const loadCustomers = async (offset = 0, reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);
    setOffset(offset);
    setError(''); 

    const result = await getUsers(filter, 'client', offset);
    
    if (result.success) {
      setCustomers(prev => [...prev, ...result.data.results]);
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

  // Перезагрузка всех покупателей
  const reloadCustomers = async () => {
    setCustomers([]);
    await loadCustomers(0, true);
  }

  // Отображение формы добавления покупателя
  const handleAddCustomer = () => {
    setShowForm(true);
  };

  // Перенаправление на страницу с информацией о клиенте
  const handleCustomerSelect = (customer) => {
    navigate(`/customers/detail/${customer.id}`);
  };

  // Удаление покупателя
  const handleDeleteCustomer = async (customer) => {
    if (!window.confirm(
      `Вы уверены, что хотите удалить покупателя ${customer.first_name} ${customer.last_name}?`
    )) {
      return;  
    }

    setLoading(true);
    setError('');
    
    const result = await deleteUser(customer.id);

    if (result.success) {
      await reloadCustomers();
    }
    else {
      setError(result.error);
    }
    setLoading(false);
  }

  // Обновление каталога при добавлении покупателя через форму 
  const handleSubmit = async () => {
    setShowForm(false);
    await reloadCustomers();
  }

  // Фильтр поиска покупателей по имени
  const onSearch = (filter) => {
    isMountedRef.current = false;
    setFilter(filter); 
  }

  const loadingContent = (
    <div>
      <LoadingComponent text={'Загрузка клиентов...'} />
    </div>
  );

  const errorContent = (
    <div>
      <ErrorRetryComponent 
        error={error}
        onClick={loadCustomers}
      />
    </div>
  );

  const notCustomersFoundContent = (
    <div className="text-center py-5 empty-state">
      <i className="bi bi-people display-1 text-muted"></i>
      <h3 className="mt-3">Ничего не найдено</h3>
    </div>
  );

  const customersListContent = (
    <div>
      {customers.length === 0 ? (
        <div className="text-center py-5 empty-state">
          <i className="bi bi-people display-1 text-muted"></i>
          <h3 className="mt-3">Покупатели отсутствуют</h3>
          <p className="text-muted">Добавьте первого покупателя</p>
          <button
            className="btn btn-primary"
            onClick={handleAddCustomer}
          >
            <i className="bi bi-person-plus me-2"></i>
            Добавить покупателя
          </button>
        </div>
      ) : (
        <div className="customers-table-container">
          <div className="table-responsive">
            <table className="table table-hover customers-table">
              <thead className="table-dark">
                <tr>
                  <th>ФИО</th>
                  <th>Логин</th>
                  <th>Email</th>
                  <th>Телефон</th>
                  <th>Дата рождения</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer.id} className="customer-row">
                    <td>
                      <div className="customer-name">
                        {customer.first_name} {customer.last_name}
                      </div>
                    </td>
                    <td>{customer.username}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone || 'Не указан'}</td>
                    <td>{formatDate(customer.date_of_birth)}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleCustomerSelect(customer)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDeleteCustomer(customer)}
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
        <LoadingComponent text={'Загрузка покупателей...'} />
      )}

      {!loading && !loadingMore && hasMore && (
        <div className="text-center my-4">
          <button 
            className="btn btn-primary"
            onClick={() => loadCustomers(offset)}
          >
            Загрузить еще
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="sales-container">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h2 className="page-title">Покупатели</h2>
          <p className="text-muted">
            Найдено покупателей: {count}
          </p>
        </div>
        {!is_show_form &&
          <button
            className="btn btn-primary"
            onClick={handleAddCustomer}
          >
            <i className="bi bi-person-plus me-2"></i>
            Добавить покупателя
          </button>
        }
      </div>

      {is_show_form && <CustomerForm 
        onSubmit={handleSubmit} 
        onCancel={() => setShowForm(false)} 
      />}

      <SearchBar onSearch={onSearch} placeholder='Поиск по имени...' />

      {loading ? (loadingContent) : (
        error ? (errorContent) : (
          (filter && customers.length === 0) ? 
            (notCustomersFoundContent) : (customersListContent)
        )
      )}
    </div>
  );
};

export default CustomerList;
