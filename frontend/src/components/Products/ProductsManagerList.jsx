import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct, updateProduct } from '../../endpoints/api';
import ErrorRetryComponent from '../ErrorRetryComponent';
import LoadingComponent from '../LoadingComponent';
import SearchBar from '../SearchBar';
import { getUnitDisplay, UNITS } from '../../utils/product';
import ProductAddForm from './ProductAddForm';
import './Products.css';

// Компонент списка товаров для управления ими
const ProductsManagerList = () => {
  const [products, setProducts] = useState([]);
  const [products_filter, setProductsFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [is_show_form, setShowForm] = useState(false);
  const navigate = useNavigate();

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

  // Появление формы добавления товара
  const handleAddProduct = () => {
    setShowForm(true);
  };

  // Перенаправление на страницу управления товаром
  const handleEditProduct = (product) => {
    navigate(`/products/detail/${product.id}`); 
  };

  // Удаление товара
  const handleDeleteProduct = async (product) => {
    if (!window.confirm(
      `Вы уверены, что хотите удалить товар ${product.name}?`
    )) {
      return;  
    }

    setLoading(true);
    setError('');
    
    const result = await deleteProduct(product.id);

    if (result.success) {
      loadProducts();
    }
    else {
      setError(result.error);
    }
    setLoading(false);
  }

  // Смена статуса доступности товара
  const handleAvailableChanging = async (product) => {
    setLoading(true);
    setError('');
    
    const result = await updateProduct(product.id, { 
      is_available: !product.is_available
    });

    if (result.success) {
      loadProducts();
    }
    else {
      setError(result.error);
    }
    setLoading(false);
  }

  // Обновление каталога при добавлении товара через форму 
  const handleSubmit = async () => {
    setShowForm(false);
    loadProducts();
  }

  // Фильтр поиска товаров по названию
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

  const notProductFoundContent = (
    <div className="text-center py-5 empty-products">
      <i className="bi bi-box display-1 text-muted"></i>
      <h3 className="mt-3">Ничего не найдено</h3>
    </div>
  );

  const productListContent = (
    <div>
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
                  <th>Доступен</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="product-row">
                    <td>
                      <div className="product-name">{product.name}</div>
                    </td>
                    <td className="product-price">
                      {parseFloat(product.price).toFixed(2)} ₽
                    </td>
                    <td className="product-unit">
                      {getUnitDisplay(product.unit)}
                    </td>
                    <td className="product-quantity">
                      {product.unit == UNITS.PIECES ?
                        parseInt(product.quantity)
                        : parseFloat(product.quantity).toFixed(2)}
                    </td>
                    <td className="product-available">
                      <input 
                        className='form-check-input' 
                        type='checkbox' 
                        checked={product.is_available}
                        onChange={() => handleAvailableChanging(product)}
                      />
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleEditProduct(product)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          <i className="bi bi-trash"></i>
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

  return (
    <div className="products-manager">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h2 className="page-title">Товары</h2>
          <p className="text-muted">
            Найдено товаров: {products.length}
          </p>
        </div>
        {!is_show_form &&
          <button
            className="btn btn-primary"
            onClick={handleAddProduct}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Добавить товар
          </button>
        }
      </div>

      {is_show_form && <ProductAddForm 
        onSubmit={handleSubmit} 
        onCancel={() => setShowForm(false)} 
      />}

      <SearchBar onSearch={onSearch} />

      {loading ? (loadingContent) : (
        error ? (errorContent) : (
          (products_filter && products.length === 0) ? 
            (notProductFoundContent) : (productListContent)
        )
      )}
    </div>
  );
};

export default ProductsManagerList;
