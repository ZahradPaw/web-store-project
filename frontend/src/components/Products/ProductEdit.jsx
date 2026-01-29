import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import './Products.css';

// Компонент редактирования товара
const ProductEdit = ({ product }) => {
  const navigate = useNavigate();

  // Отмена редактирования
  const onCancel = () => {
    navigate('/products/list'); 
  }

  return (
    <div className="product-form-container">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="bi bi-box me-2"></i>
          Редактирование товара
        </h5>
      </div>
      <ProductForm product={product} onCancel={onCancel} />
    </div>
  );
};

export default ProductEdit;
