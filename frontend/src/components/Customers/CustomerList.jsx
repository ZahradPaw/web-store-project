import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../../endpoints/api';
import ErrorComponent from '../ErrorComponent';
import LoadingComponent from '../LoadingComponent';
import './Customers.css';

// Компонент списка клиентов
const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  // Загрузка клиентов по API
  const loadCustomers = async () => {
    setLoading(true);
    setError('');

    const result = await getUsers();
    
    if (result.success) {
      // Фильтрация клиентов
      const customersData = result.data.results.filter(
        user => user.role == 'client');
      setCustomers(customersData);
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

  // Контент при загрузке
  if (loading) {
   return (
      <div className="container py-4">
        <LoadingComponent text={'Загрузка клиентов...'} />
      </div>
    );
  }

  return (
    <div className="sales-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="page-title">Покупатели</h2>
          <p className="text-muted">
            Всего покупателей: {customers.length}
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

      <ErrorComponent error={error} />

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
};

export default CustomerList;
