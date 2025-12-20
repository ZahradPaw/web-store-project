import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/Products/ProductForm';
import LoadingComponent from '../components/LoadingComponent';
import ErrorRetryComponent from '../components/ErrorRetryComponent';
import { getProduct } from '../endpoints/api';

// Страница управления деталями товара
const ProductDetailManagerPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProduct();
  }, [id]);

  // Загрузка товара
  const loadProduct = async () => {
    setLoading(true);
    setError(''); 
    
    const result = await getProduct(id);

    if (result.success) {
      setProduct(result.data)
    }
    else {
      setError(result.error);
    }
    setLoading(false);
  } 

  // Контент при загрузке
  if (loading) {
   return (
      <div className="container py-4">
        <LoadingComponent text={'Загрузка товара...'} />
      </div>
    );
  }

  // Контент при ошибке
  if (error) {
    return (
      <div className="container py-4">
        <ErrorRetryComponent 
          error={error}
          onClick={loadProduct}
        />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
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

      <ProductForm product={product} />
    </div>
  );
};

export default ProductDetailManagerPage;
