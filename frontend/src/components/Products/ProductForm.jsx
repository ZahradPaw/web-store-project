import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorComponent from '../ErrorComponent';
import { createProduct, updateProduct, deleteProduct } from '../../endpoints/api';
import { createDefaultProduct, UNITS } from '../../utils/product';
import './Products.css';

// Форма добавления и редактирования товара
const ProductForm = ({ product }) => {
  // Если параметром передан product, то осуществляется редактирование данного товара
  // В ином случае идет добавление нового товара

  const [formData, setFormData] = useState(createDefaultProduct);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        unit: product.unit || UNITS.PIECES,
        quantity: product.quantity || '',
        description: product.description || ''
      });
    }
  }, [product]);

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

      if (product) {
        await updateCurrentProduct();
      } 
      else {
        await createNewProduct(); 
      }
      setLoading(false);
    }
  };

  // Отмена редактирования
  const onCancel = () => {
    navigate('/products/list'); 
  }

  // Добавление нового товара
  const createNewProduct = async () => {
    const result = await createProduct(formData);

    if (result.success) {
      // Перенаправление на страницу со списком товаров
      navigate('/products/list');
    }
    else {
      setError(result.error);
    }
  } 

  // Обновление текущего продукта
  const updateCurrentProduct = async () => {
    const result = await updateProduct(product.id, formData);

    if (result.success) {
      // Перенаправление на страницу со списком товаров
      navigate('/products/list');
    }
    else {
      setError(result.error);
    }
  } 

  // Удаление текущего товара
  const deleteCurrentProduct = async () => {
    setLoading(true);
    setError('');
    
    const result = await deleteProduct(product.id);

    if (result.success) {
      // Перенаправление на страницу со списком товаров
      navigate('/products/list');
    }
    else {
      setError(result.error);
    }
    setLoading(false);
  }

  // Функция кнопки удаления товара
  const onDelete = async () => {
    if (window.confirm(
      `Вы уверены, что хотите удалить товар ${product.name}?`
    )) {
      await deleteCurrentProduct();  
    }
  }

  return (
    <div className="product-form-container">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="bi bi-box me-2"></i>
            {product ? 'Редактирование товара' : 'Добавление нового товара'}
          </h5>
        </div>
        <div className="card-body">

          <form onSubmit={handleSubmit}>
            <div className="row">

              <ErrorComponent error={error} />
              
              <div className="mb-3">
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

              <div className="mb-3">
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
              <div className="mb-3">
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

              <div className="mb-3">
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

           

            <div className="mb-3">
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
                    {product ? 'Сохранить изменения' : 'Добавить товар'}
                  </div>
                )}
              </button>
              {product && (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={onDelete}
                >
                  <i className="bi bi-trash me-2"></i>
                  Удалить товар
                </button>
              )}
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
    </div>
  );
};

export default ProductForm;
