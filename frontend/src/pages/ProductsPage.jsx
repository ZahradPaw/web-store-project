import React from 'react';
import ProductsCatalog from '../components/Products/ProductsCatalog';
import { useCartContext } from '../contexts/CartContext';

// Страница с каталогом товаров
const ProductsPage = () => {
  const { addToCart } = useCartContext();

  return (
    <div className="container py-4">
      <ProductsCatalog onAddToCart={addToCart} />
    </div>
  );
};

export default ProductsPage;
