import React from 'react';
import ProductsList from '../components/Products/ProductsList';
import usePageTitle from '../hooks/usePageTitle';

// Страница со списком товаров и управление имм
const ProductsPage = () => {
  usePageTitle("Товары");
  
  return (
    <div className="container py-4">
      <ProductsList />
    </div>
  );
};

export default ProductsPage;
