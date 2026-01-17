import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../LoadingComponent';
import ErrorRetryComponent from '../ErrorRetryComponent';
import { getProduct } from '../../endpoints/api';
import { getUnitDisplay, UNITS } from '../../utils/product';
import { useAuthContext } from '../../contexts/AuthContext';
import { useCartContext } from '../../contexts/CartContext';
import './Products.css';

// Компонент деталей заказа
const ProductDetail = ({ product_id }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuthContext();
  const { addToCart } = useCartContext();
  const navigate = useNavigate();

  useEffect(() => {
    loadProduct();
  }, [product_id]);

  // Загрузка товара по его ID
  const loadProduct = async () => {
    setLoading(true);
    setError('');

    const result = await getProduct(product_id);

    if (result.success)
      setProduct(result.data);
    else
      setError(result.error);
    setLoading(false);
  };

  // Добавление товара в корзину
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // Перенаправление на страницу входа, если не авторизован
      navigate('/login');
    }
    if (parseFloat(quantity) > 0 && parseFloat(quantity) <= parseFloat(product.quantity)) {
      addToCart(product, quantity);
      setQuantity(1);
    }
  };
  
  // Контент при загрузке
  if (loading) {
   return (
      <div>
        <LoadingComponent text={'Загрузка товара...'} />
      </div>
    );
  }

  // Контент при ошибке
  if (error) {
    return (
      <div>
        <ErrorRetryComponent 
          error={error}
          onClick={loadProduct}
        />
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-image-section">
          <div className="product-main-image">
            {product.photo ? (
              <img
                src={product.photo}
                alt={product.name}
                loading="lazy"
              />
            ) : (
              <i className="bi bi-image"></i>
            )}
            
            {product.quantity <= 0 && (
              <div className="product-badge out-of-stock">
                Нет в наличии
              </div>
            )}
          </div>
        </div>

        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-price-section">
            Цена: <span className="product-price"> {parseFloat(product.price)} ₽ </span>
            / {getUnitDisplay(product.unit)} 
          </div>

          <div className="product-availability">
            {product.quantity > 0 
              ? `В наличии: ${parseFloat(product.quantity)} ${getUnitDisplay(product.unit)}`
              : 'Нет в наличии'
            }
          </div>

          {product.quantity > 0 ? (
            <div className="cart-section gap-2">
              <input
                type="number"
                className="form-control quantity-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                max={product.unit === UNITS.PIECES ? Math.floor(product.quantity) : product.quantity}
                min={product.unit === UNITS.PIECES ? '1' : '0.1'}
                step={product.unit === UNITS.PIECES ? '1' : '0.1'}
              />
              <button
                className="btn text-white btn-sm flex-grow-1 add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={parseFloat(quantity) > parseFloat(product.quantity)}
              >
                <i className="bi bi-cart-plus"></i>
              </button>
            </div>
          ) : (
            <button className="btn btn-outline-secondary btn-sm w-100" disabled>
              Нет в наличии
            </button>
          )}
        </div>
      </div>

      <div className="product-details">
        <div className="description-content">
          <h3>Описание товара</h3>
          {product.description ? (
            <p>{product.description}</p>
          ) : (
            <p>Описание товара отсутствует.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail; 
