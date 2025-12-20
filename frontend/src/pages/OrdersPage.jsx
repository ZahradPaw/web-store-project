import React from 'react';
import OrdersList from '../components/Orders/OrdersList';

// Страница с заказами для клиента
const OrdersPage = () => {

  return (
    <div className="container py-4">
      <OrdersList />
    </div>
  );
};

export default OrdersPage;
