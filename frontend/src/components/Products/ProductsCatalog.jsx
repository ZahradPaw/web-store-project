import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import LoadingComponent from '../LoadingComponent';
import ErrorRetryComponent from '../ErrorRetryComponent';
import SearchBar from '../SearchBar';
import { getAvailableProducts } from '../../endpoints/api';
import { getUnitDisplay, UNITS } from '../../utils/product';
import './Products.css';

// Виды отображения каталога
const VIEW_MODES = {
  CARDS: 'cards',
  TABLE: 'table'
};

// Компонент каталога товаров для покупателей
const ProductsCatalog = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [products_filter, setProductsFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState(localStorage.getItem('catalog_view') || VIEW_MODES.CARDS); 
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, [products_filter]);

  // Загрузка товаров по API
  const loadProducts = async () => {
    setLoading(true);
    setError(''); 
    
    const result = await getAvailableProducts(products_filter);

    if (result.success) {
      setProducts(result.data.results);
    }
    else
      setError(result.error);
    setLoading(false);
  };

  // Фильтр поиска продуктов по названию
  const onSearch = (filter) => {
    setProductsFilter(filter); 
  }

  // Переключение вида отображения
  const toggleViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('catalog_view', mode)
  };

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

  // Каталог товаров в виде карточек 
  const cardViewContent = (
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
  );

  // Каталог товаров в виде таблицы
  const tableViewContent = (
    <div className="table-responsive">
      <table className="table table-hover products-catalog-table">
        <thead>
          <tr>
            <th style={{ width: '30%' }}>Наименование товара</th>
            <th style={{ width: '30%' }}>Описание</th>
            <th style={{ width: '15%' }}>В наличии</th>
            <th style={{ width: '15%' }}>Цена за единицу</th>
            <th style={{ width: '10%' }}></th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} 
              className="product-table-row"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <td>
                <div className="product-table-name">
                  <strong>{product.name}</strong>
                </div>
              </td>
              <td>
                <div className="product-table-description">
                  {product.description || (
                    <span className="text-muted">Описание отсутствует</span>
                  )}
                </div>
              </td>
              <td>
                <div className="product-table-quantity">
                  <span className="quantity-value">
                    {product.unit === UNITS.PIECES ?
                      parseInt(product.quantity) :
                      parseFloat(product.quantity).toFixed(2)} {getUnitDisplay(product.unit)}
                  </span>
                </div>
                {product.quantity <= 0 && (
                  <div className="text-danger small mt-1">Нет в наличии</div>
                )}
              </td>
              <td>
                <div className="product-table-price">
                  <strong>{parseFloat(product.price).toFixed(2)} ₽</strong>
                </div>
              </td>
              <td>
                <div className="d-flex flex-column">
                  <button
                    className="btn add-to-cart-btn text-white btn-sm flex-grow-1"
                    onClick={() => onAddToCart(product, 1)}
                    disabled={product.quantity <= 0}
                    title={product.quantity <= 0 ? 
                      "Товар недоступен" : "Добавить в корзину"}
                  >
                    <i className="bi bi-cart-plus"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const emptyContent = (
    <div className="text-center py-5">
      <i className="bi bi-inbox display-1 text-muted"></i>
      <h3 className="mt-3">Товары отсутствуют</h3>
      <p className="text-muted">Попробуйте зайти позже</p>
    </div>
  );

  const productCatalogContent = (
    <div>
      {products.length === 0 ? emptyContent : (
        viewMode === VIEW_MODES.CARDS ? cardViewContent : tableViewContent
      )}
    </div>
  );

  return (
    <div>
      <div className="row">
        <div className="col">
          <h2 className='page-title'>Каталог товаров</h2>
          <p className="text-muted">
            Найдено товаров: {products.length}
          </p>
        </div>
      </div>
     
      <SearchBar onSearch={onSearch} placeholder='Поиск товара...' />

      <div className="btn-group view-btns" role="group" aria-label="Вид отображения">
        <button
          type="button"
          className={`btn ${viewMode === VIEW_MODES.CARDS ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => toggleViewMode(VIEW_MODES.CARDS)}
          title="Вид карточками"
        >
          <i className="bi bi-grid"></i>
        </button>
        <button
          type="button"
          className={`btn ${viewMode === VIEW_MODES.TABLE ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => toggleViewMode(VIEW_MODES.TABLE)}
          title="Вид таблицей"
        >
          <i className="bi bi-list"></i>
        </button>
      </div>

      {loading ? loadingContent : (
        error ? errorContent : productCatalogContent
      )}
    </div>
  );
};

export default ProductsCatalog;
