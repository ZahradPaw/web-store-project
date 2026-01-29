import React from 'react';
import CustomerList from '../components/Customers/CustomerList';
import usePageTitle from '../hooks/usePageTitle';

// Страница с клиентами
const CustomersPage = () => {
  usePageTitle("Покупатели");

  return (
    <div className="container py-4">
      <CustomerList />
    </div>
  );
};

export default CustomersPage;
