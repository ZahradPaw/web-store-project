import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../../endpoints/api';
import ErrorRetryComponent from '../ErrorRetryComponent';
import LoadingComponent from '../LoadingComponent';
import SearchBar from '../SearchBar';
import './Customers.css';

// Компонент списка клиентов
const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [customers_filter, setCustomersFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, [customers_filter]);

  // Загрузка клиентов по API
  const loadCustomers = async () => {
    setLoading(true);
    setError('');

    const result = await getUsers(customers_filter, 'client');
    
    if (result.success) {
      setCustomers(result.data.results);
    }
    else 
      setError(result.error);
    setLoading(false);
  };

  // Перенаправление на страницу регистрации клиента
  const handleAddCustomer = () => {
    navigate('/customers/register');
  };

  // Перенаправление на страницу с информацией о клиенте
  const handleCustomerSelect = (customer) => {
    navigate(`/customers/detail/${customer.id}`);
  };

  // Фильтр поиска покупателей по имени
  const onSearch = (filter) => {
    setCustomersFilter(filter); 
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
                  <th>Дата регистрации</th>
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
                    <td>{new Date(customer.date_joined).toLocaleDateString('ru-RU')}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleCustomerSelect(customer)}
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

  return (
    <div className="sales-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="page-title">Покупатели</h2>
          <p className="text-muted">
            Найдено покупателей: {customers.length}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleAddCustomer}
        >
          <i className="bi bi-person-plus me-2"></i>
          Добавить покупателя
        </button>
      </div>

      <SearchBar onSearch={onSearch} placeholder='Поиск по имени...' />

      {loading ? (loadingContent) : (
        error ? (errorContent) : (
          (customers_filter && customers.length === 0) ? 
            (notCustomersFoundContent) : (customersListContent)
        )
      )}
    </div>
  );
};

export default CustomerList;
