import React from 'react';
import OrdersManagerList from '../components/Orders/OrdersManagerList';
import usePageTitle from '../hooks/usePageTitle';

// Список со всеми заказами для продавца
const OrdersManagerPage = () => {
  usePageTitle("Заказы");

  return (
    <div className="container py-4">
      <OrdersManagerList />
    </div>
  );
};

export default OrdersManagerPage;
