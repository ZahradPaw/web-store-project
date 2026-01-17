import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductDetail from '../components/Products/ProductDetail';

// Страница с информацией о товаре
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate('/')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Назад к каталогу товаров
          </button>
        </div>
      </div>

      <ProductDetail product_id={id} />
    </div>
  );
};

export default ProductDetailPage;
