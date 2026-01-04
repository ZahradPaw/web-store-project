import React, { useState, useEffect } from 'react';
import ErrorComponent from '../ErrorComponent';
import { createProduct } from '../../endpoints/api';
import { createDefaultProduct, UNITS } from '../../utils/product';
import './Products.css';

// Упрощенная форма добавления товара 
const ProductAddForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(createDefaultProduct);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очистка ошибки при изменений полей
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Название товара обязательно';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Цена должна быть положительным числом';
    }

    if (!formData.quantity || parseFloat(formData.quantity) < 0) {
      newErrors.quantity = 'Количество не может быть отрицательным';
    }

    if (formData.unit === 'pieces' && formData.quantity
      && !Number.isInteger(parseFloat(formData.quantity))) {
      newErrors.quantity = 'Для штучных товаров количество должно быть целым числом';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {

      setLoading(true);
      setError('');
      setErrors({}); 

      const result = await createProduct(formData);

      if (result.success) {
        onSubmit();
      }
      else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <ErrorComponent error={error} />

            <div className="mb-1">
              <label htmlFor="name" className="form-label">
                Название товара *
              </label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Введите название товара"
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>
            <div className="mb-1">
              <label htmlFor="price" className="form-label">
                Цена (₽) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
              />
              {errors.price && (
                <div className="invalid-feedback">{errors.price}</div>
              )}
            </div>
            <div className="mb-1">
              <label htmlFor="unit" className="form-label">
                Единица измерения *
              </label>
              <select
                className="form-select"
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              >
                <option value="pieces">Штуки</option>
                <option value="kg">Килограммы</option>
                <option value="liter">Литры</option>
              </select>
            </div>
            <div className="mb-1">
              <label htmlFor="quantity" className="form-label">
                Количество на складе *
              </label>
              <input
                type="number"
                step={formData.unit === UNITS.PIECES ? '1' : '0.01'}
                min="0"
                className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder={formData.unit === UNITS.PIECES ? '0' : '0.00'}
              />
              {errors.quantity && (
                <div className="invalid-feedback">{errors.quantity}</div>
              )}
            </div>
          </div>
          <div className="mb-1">
            <label htmlFor="description" className="form-label">
              Описание товара
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Введите описание товара (необязательно)"
            />
          </div>
          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Сохранение...
                </div>
              ) : (
                <div>
                  <i className="bi bi-check-circle me-2"></i>
                  Добавить товар
                </div>
              )}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              <i className="bi bi-x-circle me-2"></i>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductAddForm;
