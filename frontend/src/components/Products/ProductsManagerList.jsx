import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../endpoints/api';
import ErrorRetryComponent from '../ErrorRetryComponent';
import LoadingComponent from '../LoadingComponent';
import SearchBar from '../SearchBar';
import './Products.css';

// Компонент списка товаров для управления ими
const ProductsManagerList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  // Загрузка товаров по API
  const loadProducts = async () => {
    setLoading(true);
    setError(''); 

    const result = await getProducts();

    if (result.success)
      setProducts(result.data.results);
    else
      setError(result.error);
    setLoading(false);
  };

  // Перенаправление на страницу добавления товара
  const handleAddProduct = () => {
    navigate('/products/create'); 
  };

  // Перенаправление на страницу управления товаром
  const handleEditProduct = (product) => {
    navigate(`/products/detail/${product.id}`); 
  };

  const getUnitDisplay = (unit) => {
    const units = {
      'pieces': 'шт',
      'kg': 'кг',
      'liter': 'л'
    };
    return units[unit] || unit;
  };

  const onSearch = (filter) => {
    console.log(filter); 
  }

  // Контент при загрузке
  if (loading) {
   return (
      <div>
        <LoadingComponent text={'Загрузка товаров...'} />
      </div>
    );
  }

  // Контент при ошибке
  if (error) {
    return (
      <div>
        <ErrorRetryComponent 
          error={error}
          onClick={loadProducts}
        />
      </div>
    );
  }

  return (
    <div className="products-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="page-title">Управление товарами</h2>
          <p className="text-muted">
            Всего товаров: {products.length}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleAddProduct}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Добавить товар
        </button>
      </div>

      <SearchBar onSearch={onSearch} />

      {products.length === 0 ? (
        <div className="text-center py-5 empty-products">
          <i className="bi bi-box display-1 text-muted"></i>
          <h3 className="mt-3">Товары отсутствуют</h3>
          <p className="text-muted">Добавьте первый товар в каталог</p>
          <button
            className="btn btn-primary"
            onClick={handleAddProduct}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Добавить товар
          </button>
        </div>
      ) : (
        <div className="products-table-container">
          <div className="table-responsive">
            <table className="table table-hover products-table">
              <thead className="table-dark">
                <tr>
                  <th>Название</th>
                  <th>Цена</th>
                  <th>Ед. изм.</th>
                  <th>Количество</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="product-row">
                    <td>
                      <div className="product-name">{product.name}</div>
                      {product.description && (
                        <div className="product-description">
                          {product.description}
                        </div>
                      )}
                    </td>
                    <td className="product-price">
                      {parseFloat(product.price).toFixed(2)} ₽
                    </td>
                    <td className="product-unit">
                      {getUnitDisplay(product.unit)}
                    </td>
                    <td className="product-quantity">
                      {product.unit == "pieces" ?
                        parseInt(product.quantity)
                        : parseFloat(product.quantity).toFixed(2)}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleEditProduct(product)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagerList;
