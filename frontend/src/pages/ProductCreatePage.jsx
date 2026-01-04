import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/Products/ProductForm';

// Страница управления деталями товара
const ProductCreatePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      <div className="row mb-2">
        <div className="col-12">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate('/products/list')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Назад к списку товаров
          </button>
        </div>
      </div>

      <ProductForm />
    </div>
  );
};

export default ProductCreatePage;
