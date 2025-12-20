import React from 'react';
import CustomerList from '../components/Customers/CustomerList';

// Страница с клиентами
const CustomersPage = () => {
  return (
    <div className="container py-4">
      <CustomerList />
    </div>
  );
};

export default CustomersPage;
