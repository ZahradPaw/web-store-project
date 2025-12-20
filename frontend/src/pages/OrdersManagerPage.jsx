import React from 'react';
import OrdersManagerList from '../components/Orders/OrdersManagerList';

// Список со всеми заказами для продавца
const OrdersManagerPage = () => {
  return (
    <div className="container py-4">
      <OrdersManagerList />
    </div>
  );
};

export default OrdersManagerPage;
