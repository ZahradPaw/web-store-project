import React from 'react';
import OrdersList from '../components/Orders/OrdersList';
import usePageTitle from '../hooks/usePageTitle';

// Страница с заказами для клиента
const OrdersPage = () => {
  usePageTitle("Мои заказы");

  return (
    <div className="container py-4">
      <OrdersList />
    </div>
  );
};

export default OrdersPage;
