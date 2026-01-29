import React from 'react';
import ProductsCatalog from '../components/Products/ProductsCatalog';
import { useCartContext } from '../contexts/CartContext';
import usePageTitle from '../hooks/usePageTitle';

// Страница с каталогом товаров
const ProductsCatalogPage = () => {
  const { addToCart } = useCartContext();

  usePageTitle('Каталог товаров');

  return (
    <div className="container py-4">
      <ProductsCatalog onAddToCart={addToCart} />
    </div>
  );
};

export default ProductsCatalogPage;
