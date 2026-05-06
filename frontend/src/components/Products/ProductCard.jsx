import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import slugify from 'slugify';
import { useAuthContext } from '../../contexts/AuthContext';
import { UNITS, getUnitDisplay } from '../../utils/product';
import './Products.css';

// Компонент карточки товара на станице с товарами
const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  // Получение URL изображения
  const getImageUrl = () => {
    if (!product.photo) return null;

    return `${process.env.REACT_APP_API_URL || ''}${product.photo}`;
  };

  const imageUrl = getImageUrl();

  // Добавление товара в корзину
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // Перенаправление на страницу входа, если не авторизован
      navigate('/login');
    }
    if (parseFloat(quantity) > 0 && parseFloat(quantity) <= parseFloat(product.quantity)) {
      onAddToCart(product, quantity);
      setQuantity(1);
    }
  };

  // Перенаправление на страницу товара при нажатии на карточку
  const handleProductClick = () => {
    navigate(`/product/${product.id}/${slugify(product.name, {lower: true})}`);
  };

  return (
    <div className="card product-card">
      <div className="product-image" onClick={handleProductClick}>
        {product.photo ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <i className="bi bi-image"></i>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="product-title">{product.name}</h5>
        <div className="mb-2">
          <span className="badge bg-secondary product-badge">
            {getUnitDisplay(product.unit)}
          </span>
        </div>

        <p className="card-text text-muted small flex-grow-1">
          {product.description || 'Описание товара отсутствует'}
        </p>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="product-price">
              {parseFloat(product.price).toFixed(2)} ₽
            </span>
            <small className="product-stock">
              В наличии: {parseFloat(product.quantity)} {getUnitDisplay(product.unit)}
            </small>
          </div>

          {product.quantity > 0 ? (
            <div className="d-flex gap-2">
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
    </div>
  );
};

export default ProductCard;
