import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import LoadingComponent from '../LoadingComponent';
import ErrorRetryComponent from '../ErrorRetryComponent';
import SearchBar from '../SearchBar';
import { getProducts } from '../../endpoints/api';
import './Products.css';

// Компонент списка всех товаров для заказа
const ProductsCatalog = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [products_filter, setProductsFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, [products_filter]);

  // Загрузка товаров по API
  const loadProducts = async () => {
    setLoading(true);
    setError(''); 
    
    const result = await getProducts(products_filter);

    if (result.success)
      setProducts(result.data.results);
    else
      setError(result.error);
    setLoading(false);
  };

  // Фильтр поиска продуктов по названию
  const onSearch = (filter) => {
    setProductsFilter(filter); 
  }

  const loadingContent = (
    <div>
      <LoadingComponent text={'Загрузка товаров...'} />
    </div>
  );

  const errorContent = (
    <div>
      <ErrorRetryComponent 
        error={error}
        onClick={loadProducts}
      />
    </div>
  );

  const productCatalogContent = (
    <div>
      {products.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <h3 className="mt-3">Товары отсутствуют</h3>
          <p className="text-muted">Попробуйте зайти позже</p>
        </div>
      ) : (
        <div className="row g-4">
          {products.map(product => (
            <div key={product.id} className="col-sm-6 col-md-4 col-lg-3">
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="row mb-4">
        <div className="col">
          <h2 className='page-title'>Каталог товаров</h2>
          <p className="text-muted">
            Найдено товаров: {products.length}
          </p>
        </div>
      </div>

      <SearchBar onSearch={onSearch} placeholder='Поиск товара...' />

      {loading ? (loadingContent) : (
        error ? (errorContent) : (productCatalogContent)
      )}
    </div>
  );
};

export default ProductsCatalog;
