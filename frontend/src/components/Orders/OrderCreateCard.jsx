import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorComponent from '../ErrorComponent';
import LoadingComponent from '../LoadingComponent';
import { getProducts, getUsers, 
  createOrder, getCustomerOrders } from '../../endpoints/api';
import { UNITS, getUnitDisplay } from '../../utils/product';
import { getStatusBadge, getStatusDisplay } from '../../utils/order';
import { ROLES } from '../../utils/user';
import { formatDate } from '../../utils/utils';
import SearchBar from '../SearchBar';
import './Orders.css';

// Компонент создания заказа продавцом
const OrderCreateCard = ({ onSubmit }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerID, setSelectedCustomerID] = useState('');
  const [customerOrders, setCustomerOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadCustomerOrders();
  }, [selectedCustomerID]);

  // Загрузка клиентов и товаров
  const loadData = async () => {
    setLoading(true);
    setError('');

    const resultUsers = await getUsers('', ROLES.CLIENT);
    const resultProducts = await getProducts();

    if (resultUsers.success && resultProducts.success) {
      setCustomers(resultUsers.data.results);
      setProducts(resultProducts.data.results);
    }
    else {
      setError(resultUsers.error + '\n' + resultProducts.error);
    }
    setLoading(false);
  };

  // Загрузка заказов выбранного покупателя
  const loadCustomerOrders = async () => {
    if (!selectedCustomerID) return;

    setLoading(true);
    setError('');
    
    const result = await getCustomerOrders(selectedCustomerID);

    if (result.success) {
      setCustomerOrders(result.data.results);
    }
    else {
      setError(result.error);
    }
    setLoading(false);
  };

  // Добавление товара в корзину
  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  // Удаление товара из корзины
  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  // Обновление кол-ва товаров
  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: parseFloat(quantity) }
          : item
      ));
    }
  };

  // Создание заказа
  const handleSubmit = async () => {
    if (!selectedCustomerID) {
      setError('Выберите покупателя');
      return;
    }

    if (cart.length === 0) {
      setError('Добавьте товары в заказ');
      return;
    }

    setLoading(true);
    setError('');
    const orderData = {
      client: parseInt(selectedCustomerID),
      items: cart.map(item => ({
        product: item.product.id,
        quantity: item.quantity
      }))
    };

    // Отправка запроса на создание заказа
    const result = await createOrder(orderData);

    if (result.success) {
      onSubmit(result.data);
    }
    else {
      setError(result.error);
    }
    setLoading(false);
  };

  // Очистка товаров
  const handleOnCancel = () => {
    setCart([]);
  }

  // Получение общей суммы заказа
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      return total + (parseFloat(item.product.price) * parseFloat(item.quantity));
    }, 0);
  };

  // Контент при загрузке
  if (loading) {
   return (
      <div>
        <LoadingComponent text={'Загрузка данных...'} />
      </div>
    );
  }

  return (
    <div className="create-sale-container">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="bi bi-cart-plus me-2"></i>
            Оформление продажи
          </h5>
        </div>
        <div className="card-body">
          <ErrorComponent error={error} />

          <div className="row">
            <div className="col-md-6">
              <div className="mb-4">
                <h6>Покупатели</h6>
                <select
                  className="form-select"
                  value={selectedCustomerID}
                  onChange={(e) => setSelectedCustomerID(e.target.value)}
                >
                  <option value="">Выберите покупателя</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.first_name} {customer.last_name} ({customer.email})
                    </option>
                  ))}
                </select>
              </div>

              <h6>Доступные товары</h6>
              <SearchBar placeholder='Поиск товаров...' />
              <div className="products-list">
                {products.map(product => (
                  <div key={product.id} className="product-item card mb-2">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="product-name">{product.name}</div>
                          <div className="product-price">
                            {parseFloat(product.price).toFixed(2)} ₽ / {getUnitDisplay(product.unit)}
                          </div>
                          <div className="product-stock">
                            В наличии: {parseFloat(product.quantity)} {getUnitDisplay(product.unit)}
                          </div>
                        </div>
                        <div className="col-md-6 text-end">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.quantity <= 0}
                          >
                            <i className="bi bi-plus me-1"></i>
                            Добавить
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-md-6">
              {selectedCustomerID && (
                <div className="mb-4">
                  <h6>Заказы выбранного покупателя</h6>
                  <ErrorComponent error={error} />

                  <div className='products-list'>
                  {loading ? (
                    <div className="text-center py-3">
                      <div className="spinner-border spinner-border-sm text-primary"></div>
                      <span className="ms-2">Загрузка заказов...</span>
                    </div>
                  ) : customerOrders.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-cart text-muted display-6"></i>
                      <p className="text-muted mt-2">У клиента пока нет заказов</p>
                    </div>
                  ) : (
                    <div className="orders-list">
                      {customerOrders.map(order => (
                        <div
                          key={order.id}
                          className="order-item card mb-2"
                          onClick={() => navigate(`/orders/detail/${order.id}`)}
                        >
                          <div className="card-body py-2">
                            <div className="row align-items-center">
                              <div className="col-md-3">
                                <strong>Заказ #{order.id}</strong>
                              </div>
                              <div className="col-md-3">
                                {formatDate(order.order_date)}
                              </div>
                              <div className="col-md-3">
                                {parseFloat(order.total_price).toFixed(2)} ₽
                              </div>
                              <div className="col-md-3">
                                <span className={getStatusBadge(order.status)}>
                                  {getStatusDisplay(order.status)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h6>Товары в заказе</h6>
                {cart.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-cart display-6"></i>
                    <p>Товары не добавлены</p>
                  </div>
                ) : (
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.product.id} className="cart-item card mb-2">
                        <div className="card-body">
                          <div className="row align-items-center">
                            <div className="col-md-5">
                              <div className="product-name">{item.product.name}</div>
                            </div>
                            <div className="col-md-3">
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                value={item.quantity}
                                onChange={(e) => handleUpdateQuantity(item.product.id, e.target.value)}
                                min="0.1"
                                step={item.product.unit ===  UNITS.PIECES ? '1' : '0.1'}
                              />
                            </div>
                            <div className="col-md-2 text-end">
                              {parseFloat(item.product.price * item.quantity).toFixed(2)} ₽
                            </div>
                            <div className="col-md-2 text-end">
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleRemoveFromCart(item.product.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="cart-total card mt-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <strong>Итого:</strong>
                          <strong className="text-primary">
                            {getTotalPrice().toFixed(2)} ₽
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="d-grid gap-2 mt-3">
                      <button
                        className="btn btn-success"
                        onClick={handleSubmit}
                        disabled={loading || !selectedCustomerID || cart.length === 0}
                      >
                        {loading ? (
                          <div>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Оформление...
                          </div>
                        ) : (
                          <div>
                            <i className="bi bi-check-circle me-2"></i>
                            Оформить продажу
                          </div>
                        )}
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={handleOnCancel}
                        disabled={loading}
                      >
                        <i className="bi bi-trash me-2"></i>
                        Очистить 
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCreateCard;
