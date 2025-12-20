import React from 'react';
import ProductsManagerList from '../components/Products/ProductsManagerList';

// Страница со списком товаров и управление имм
const ProductsManagerPage = () => {
  return (
    <div className="container py-4">
      <ProductsManagerList />
    </div>
  );
};

export default ProductsManagerPage;
