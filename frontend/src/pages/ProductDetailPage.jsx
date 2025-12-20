import React from 'react';
import { useParams } from 'react-router-dom';

// Страница с каталогом товаров
const ProductDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="container py-4">
      Здесь инфа о продукте #{id} будет!
    </div>
  );
};

export default ProductDetailPage;
