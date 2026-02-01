import React, { useState, useEffect } from 'react';
import { getProducts, getUsers, getOrders } from '../../endpoints/api';
import LoadingComponent from '../LoadingComponent';
import ErrorRetryComponent from '../ErrorRetryComponent';
import SearchBar from '../SearchBar';
import { getUnitDisplay } from '../../utils/product';
import { getStatusDisplay, getStatusBadge } from '../../utils/order';
import { ROLES } from '../../utils/user';
import { formatDate, formatDateTime } from '../../utils/utils';
import './Report.css';

// Компонент просмотра и фильрации данных по таблицам товаров, покупателей и заказов для формирования отчетов
const ReportComponent = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState({ 
    products: true, 
    customers: true, 
    orders: true 
  });
  const [error, setError] = useState({ 
    products: '', 
    customers: '', 
    orders: '' 
  });
  
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    products: {},
    customers: {},
    orders: {}
  });

  // Состояния для показа/скрытия столбцов
  const [visibleColumns, setVisibleColumns] = useState({
    products: {
      name: true,
      price: true,
      unit: true,
      quantity: true,
      description: true,
      is_available: true
    },
    customers: {
      username: true,
      email: true,
      first_name: true,
      last_name: true,
      phone: true,
      date_of_birth: true,
      total_spent: true,
      is_regular: true
    },
    orders: {
      id: true,
      client_name: true,
      order_date: true,
      delivery_date: true,
      total_price: true,
      status: true,
      items: true
    }
  });

  // Состояния для развернутых заказов
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    filterData();
  }, [products, customers, orders, searchTerm, filters, activeTab]);

  // Загрузка данных всех таблиц
  const loadAllData = async () => {

    // Загрузка сразу всех товаров
    const productsResult = await getProducts();
    let productsAllResult;
    if (productsResult.success) {
      productsAllResult = await getProducts('', 0, productsResult.data.count);
    }

    if (productsResult.success && productsAllResult?.success) {
      setProducts(productsAllResult.data.results || productsAllResult.data);
      setFilteredProducts(productsAllResult.data.results || productsAllResult.data);
    }
    else {
      setError(prev => ({ ...prev, products: productsResult.error || productsAllResult.error }));
    }
    setLoading(prev => ({ ...prev, products: false }));

    // Загрузка сразу всех пользователей 
    const customersResult = await getUsers('', ROLES.CLIENT);
    let customersAllResult;
    if (customersResult.success) {
      customersAllResult = await getUsers('', ROLES.CLIENT, 0, customersResult.data.count);
    }

    if (customersResult.success && customersAllResult?.success) {
      setCustomers(customersAllResult.data.results || customersAllResult.data);
      setFilteredCustomers(customersAllResult.data.results || customersAllResult.data);
    }
    else {
      setError(prev => ({ ...prev, customers: customersResult.error || customersAllResult.error }));
    }
    setLoading(prev => ({ ...prev, customers: false }));

    // Загрузка срвзу всех заказов 
    const ordersResult = await getOrders();
    let ordersAllResult;
    if (ordersResult.success) {
      ordersAllResult = await getOrders('', 0, ordersResult.data.count);
    }

    if (ordersResult.success && ordersAllResult?.success) {
      setOrders(ordersAllResult.data.results || ordersAllResult.data);
      setFilteredOrders(ordersAllResult.data.results || ordersAllResult.data);
    }
    else {
      setError(prev => ({ ...prev, orders: ordersResult.error || ordersAllResult.error }));
    }
    setLoading(prev => ({ ...prev, orders: false }));
  };

  // Фильтрация всех данных таблиц
  const filterData = () => {
    // Фильтрация товаров
    let filteredProds = [...products];
    if (searchTerm && activeTab === 'products') {
      const term = searchTerm.toLowerCase();
      filteredProds = filteredProds.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
      );
    }
    
    if (filters.products.unit) {
      filteredProds = filteredProds.filter(p => p.unit === filters.products.unit);
    }
    
    if (filters.products.minPrice) {
      filteredProds = filteredProds.filter(p => p.price >= parseFloat(filters.products.minPrice));
    }
    
    if (filters.products.maxPrice) {
      filteredProds = filteredProds.filter(p => p.price <= parseFloat(filters.products.maxPrice));
    }
    
    setFilteredProducts(filteredProds);

    // Фильтрация покупателей
    let filteredCstmrs = [...customers];
    if (searchTerm && activeTab === 'customers') {
      const term = searchTerm.toLowerCase();
      filteredCstmrs = filteredCstmrs.filter(u =>
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.first_name?.toLowerCase().includes(term) ||
        u.last_name?.toLowerCase().includes(term)
      );
    }
    
    if (filters.customers.is_regular) {
      filteredCstmrs = filteredCstmrs.filter(u => 
        filters.customers.is_regular === 'true' ? u.is_regular : !u.is_regular
      );
    }

    if (filters.customers.date_of_birth) {
      filteredCstmrs = filteredCstmrs.filter(u => u.date_of_birth >= filters.customers.date_of_birth);
    }
    
    if (filters.customers.minSpent) {
      filteredCstmrs = filteredCstmrs.filter(u => u.total_spent >= parseFloat(filters.customers.minSpent));
    }
    
    setFilteredCustomers(filteredCstmrs);

    // Фильтрация заказов
    let filteredOrds = [...orders];
    if (searchTerm && activeTab === 'orders') {
      const term = searchTerm.toLowerCase();
      filteredOrds = filteredOrds.filter(o =>
        o.id.toString().includes(term) ||
        o.client_name?.toLowerCase().includes(term) ||
        o.client_email?.toLowerCase().includes(term)
      );
    }
    
    if (filters.orders.status) {
      filteredOrds = filteredOrds.filter(o => o.status === filters.orders.status);
    }
    
    if (filters.orders.startDate) {
      const startDate = new Date(filters.orders.startDate);
      filteredOrds = filteredOrds.filter(o => new Date(o.order_date) >= startDate);
    }
    
    if (filters.orders.endDate) {
      const endDate = new Date(filters.orders.endDate);
      filteredOrds = filteredOrds.filter(o => new Date(o.order_date) <= endDate);
    }
    
    if (filters.orders.minTotal) {
      filteredOrds = filteredOrds.filter(o => o.total_price >= parseFloat(filters.orders.minTotal));
    }
    
    setFilteredOrders(filteredOrds);
  };

  // Поиск 
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Изменение фильтров
  const handleFilterChange = (filterType, filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: {
        ...prev[filterType],
        [filterName]: value
      }
    }));
  };

  // Очистка фильтров
  const clearFilters = (filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: {}
    }));
    setSearchTerm('');
  };

  // Управление видимостью столбцов
  const toggleColumnVisibility = (table, column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [table]: {
        ...prev[table],
        [column]: !prev[table][column]
      }
    }));
  };

  // Развернуть/свернуть товары в заказе
  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  // Определение доступных столбцов для каждой таблицы
  const getColumnConfig = (table) => {
    const configs = {
      products: [
        { key: 'name', label: 'Название', width: '200px' },
        { key: 'price', label: 'Цена', width: '100px' },
        { key: 'unit', label: 'Ед. изм.', width: '100px' },
        { key: 'quantity', label: 'Количество', width: '120px' },
        { key: 'description', label: 'Описание', width: '250px' },
        { key: 'is_available', label: 'Доступен', width: '100px' },
      ],
      customers: [
        { key: 'username', label: 'Логин', width: '150px' },
        { key: 'email', label: 'Email', width: '200px' },
        { key: 'first_name', label: 'Имя', width: '120px' },
        { key: 'last_name', label: 'Фамилия', width: '120px' },
        { key: 'phone', label: 'Телефон', width: '150px' },
        { key: 'date_of_birth', label: 'Дата рождения', width: '150px' },
        { key: 'total_spent', label: 'Общая сумма', width: '150px' },
        { key: 'is_regular', label: 'Постоянный', width: '100px' }
      ],
      orders: [
        { key: 'id', label: 'Номер', width: '80px' },
        { key: 'client_name', label: 'Клиент', width: '150px' },
        { key: 'order_date', label: 'Дата заказа', width: '180px' },
        { key: 'delivery_date', label: 'Доставка', width: '120px' },
        { key: 'total_price', label: 'Сумма', width: '120px' },
        { key: 'status', label: 'Статус', width: '120px' }
      ]
    };
    return configs[table];
  };

  if (loading.products && loading.customers && loading.orders) {
    return <LoadingComponent text="Загрузка данных для отчётов..." />;
  }

  return (
    <div className="director-reports">
      <div className="reports-header">
        <h2 className="page-title">Отчёты</h2>
        <p className="text-muted">Просмотр и фильтрация данных по всем таблицам</p>
      </div>

      <div className="reports-tabs">
        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <i className="bi bi-box me-2"></i>
            Товары ({products.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <i className="bi bi-people me-2"></i>
            Покупатели ({customers.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="bi bi-cart me-2"></i>
            Заказы ({orders.length})
          </button>
        </div>

        <div className="tab-content">
          <div className="search-filters-section">
            <div className="search-container">
              <SearchBar
                placeholder={`Поиск по ${activeTab === 'products' ? 'товарам' : 
                  activeTab === 'customers' ? 'покупателям' : 'имени покупателя'}...`}
                onSearch={handleSearch}
                initialValue={searchTerm}
              />
            </div>

            <div className="filters-container">
              {activeTab === 'products' && (
                <div className="filters-row">
                  <div className="filter-item">
                    <label>Ед. измерения:</label>
                    <select
                      className="form-select form-select-sm"
                      value={filters.products.unit || ''}
                      onChange={(e) => handleFilterChange('products', 'unit', e.target.value)}
                    >
                      <option value="">Все</option>
                      <option value="pieces">Штуки</option>
                      <option value="kg">Килограммы</option>
                      <option value="liter">Литры</option>
                    </select>
                  </div>

                  <div className="filter-item">
                    <label>Цена от:</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={filters.products.minPrice || ''}
                      onChange={(e) => handleFilterChange('products', 'minPrice', e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>

                  <div className="filter-item">
                    <label>Цена до:</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={filters.products.maxPrice || ''}
                      onChange={(e) => handleFilterChange('products', 'maxPrice', e.target.value)}
                      placeholder="999999.00"
                      step="0.01"
                    />
                  </div>

                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => clearFilters('products')}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Очистить
                  </button>
                </div>
              )}

              {activeTab === 'customers' && (
                <div className="filters-row">
                  <div className="filter-item">
                    <label>Тип клиента:</label>
                    <select
                      className="form-select form-select-sm"
                      value={filters.customers.is_regular || ''}
                      onChange={(e) => handleFilterChange('customers', 'is_regular', e.target.value)}
                    >
                      <option value="">Все</option>
                      <option value="true">Постоянные</option>
                      <option value="false">Новые</option>
                    </select>
                  </div>

                  <div className="filter-item">
                    <label>Дата рождения с:</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={filters.customers.date_of_birth || ''}
                      onChange={(e) => handleFilterChange('customers', 'date_of_birth', e.target.value)}
                    />
                  </div>

                  <div className="filter-item">
                    <label>Общая сумма покупок от:</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={filters.customers.minSpent || ''}
                      onChange={(e) => handleFilterChange('customers', 'minSpent', e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>

                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => clearFilters('customers')}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Очистить
                  </button>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="filters-row">
                  <div className="filter-item">
                    <label>Статус:</label>
                    <select
                      className="form-select form-select-sm"
                      value={filters.orders.status || ''}
                      onChange={(e) => handleFilterChange('orders', 'status', e.target.value)}
                    >
                      <option value="">Все</option>
                      <option value="created">Оформлен</option>
                      <option value="paid">Оплачен</option>
                      <option value="delivered">Доставлен</option>
                      <option value="cancelled">Отменен</option>
                    </select>
                  </div>

                  <div className="filter-item">
                    <label>Дата с:</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={filters.orders.startDate || ''}
                      onChange={(e) => handleFilterChange('orders', 'startDate', e.target.value)}
                    />
                  </div>

                  <div className="filter-item">
                    <label>Дата по:</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={filters.orders.endDate || ''}
                      onChange={(e) => handleFilterChange('orders', 'endDate', e.target.value)}
                    />
                  </div>

                  <div className="filter-item">
                    <label>Общая сумма от:</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={filters.orders.minTotal || ''}
                      onChange={(e) => handleFilterChange('orders', 'minTotal', e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>

                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => clearFilters('orders')}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Очистить
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="results-info">
            Найдено: {activeTab === 'products' ? filteredProducts.length :
                    activeTab === 'customers' ? filteredCustomers.length :
                    filteredOrders.length}
            {' '}из{' '}
            {activeTab === 'products' ? products.length :
             activeTab === 'customers' ? customers.length :
             orders.length}
            {searchTerm && (
              <span className="ms-2">
                По запросу: "<strong>{searchTerm}</strong>"
              </span>
            )}
          </div>

          {/* Панель выбора отображаемых столбцов */}
          <div className="columns-selection-panel">
            <div className="columns-checkboxes">
              {getColumnConfig(activeTab).map(column => (
                <div key={column.key} className="column-checkbox-item">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`column-${activeTab}-${column.key}`}
                      checked={visibleColumns[activeTab][column.key] || false}
                      onChange={() => toggleColumnVisibility(activeTab, column.key)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`column-${activeTab}-${column.key}`}
                    >
                      {column.label}
                    </label>
                  </div>
                </div>
              ))}
              {activeTab === 'orders' &&
                <div className="column-checkbox-item">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`column-orders-items`}
                      checked={visibleColumns[activeTab]['items'] || false}
                      onChange={() => toggleColumnVisibility(activeTab, 'items')}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`column-orders-items`}
                    >
                      Элементы товара
                    </label>
                  </div>
                </div>
              }
            </div>
          </div>
          
          
          {/* Таблицы */}
          {error[activeTab] ? (
            <ErrorRetryComponent 
              error={error[activeTab]}
              onClick={loadAllData}
            />
          ) : (
            <div className="data-table-container">

              {/* Таблицы товаров */}
              {activeTab === 'products' && (
                <div className="table-responsive">
                  <table className="table table-sm table-striped table-hover">
                    <thead>
                      <tr>
                        {getColumnConfig(activeTab)
                          .filter(col => visibleColumns.products[col.key])
                          .map(col => (
                            <th key={col.key} style={{ width: col.width }}>
                              {col.label}
                            </th>
                          ))
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(product => (
                        <tr key={product.id}>
                          {getColumnConfig(activeTab)
                            .filter(col => visibleColumns.products[col.key])
                            .map(col => {
                              switch(col.key) {
                                case 'price':
                                  return (
                                    <td key={col.key}>
                                      {parseFloat(product[col.key]).toFixed(2)} ₽
                                    </td>
                                  );
                                case 'quantity':
                                  return (
                                    <td key={col.key}>
                                      {product.unit === "pieces" ?
                                        parseInt(product[col.key]) :
                                        parseFloat(product[col.key]).toFixed(2)}
                                    </td>
                                  );
                                case 'unit':
                                  return (
                                    <td key={col.key}>
                                      {getUnitDisplay(product[col.key])}
                                    </td>
                                  );
                                case 'is_available':
                                  return (
                                    <td key={col.key}>
                                      {product[col.key] ? (
                                        <span className="badge bg-success">Да</span>
                                      ) : (
                                        <span className="badge bg-danger">Нет</span>
                                      )}
                                    </td>
                                  );
                                default:
                                  return (
                                    <td key={col.key} className="text-truncate" style={{ maxWidth: '200px' }}>
                                      {product[col.key] || '-'}
                                    </td>
                                  );
                              }
                            })
                          }
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Таблица покупателей */}
              {activeTab === 'customers' && (
                <div className="table-responsive">
                  <table className="table table-sm table-striped table-hover">
                    <thead>
                      <tr>
                        {getColumnConfig(activeTab)
                          .filter(col => visibleColumns.customers[col.key])
                          .map(col => (
                            <th key={col.key} style={{ width: col.width }}>
                              {col.label}
                            </th>
                          ))
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map(customer => (
                        <tr key={customer.id}>
                          {getColumnConfig(activeTab)
                            .filter(col => visibleColumns.customers[col.key])
                            .map(col => {
                              switch(col.key) {
                                case 'total_spent':
                                  return (
                                    <td key={col.key}>
                                      {parseFloat(customer[col.key] || 0).toFixed(2)} ₽
                                    </td>
                                  );
                                case 'is_regular':
                                  return (
                                    <td key={col.key}>
                                      <span className={`badge ${customer[col.key] ? 'bg-success' : 'bg-secondary'}`}>
                                        {customer[col.key] ? 'Да' : 'Нет'}
                                      </span>
                                    </td>
                                  );
                                case 'first_name':
                                case 'last_name':
                                  return (
                                    <td key={col.key}>
                                      {customer[col.key] || '-'}
                                    </td>
                                  );
                                default:
                                  return (
                                    <td key={col.key} className="text-truncate" style={{ maxWidth: '200px' }}>
                                      {customer[col.key] || '-'}
                                    </td>
                                  );
                              }
                            })
                          }
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Таблица заказов */}
              {activeTab === 'orders' && (
                <div className="table-responsive">
                  <table className="table table-sm table-striped table-hover">
                    <thead>
                      <tr>
                        {getColumnConfig(activeTab)
                          .filter(col => visibleColumns.orders[col.key])
                          .map(col => (
                            <th key={col.key} style={{ width: col.width }}>
                              {col.label}
                            </th>
                          ))
                        }
                        {visibleColumns.orders.items && 
                          <th style={{ width: '50px' }}></th>
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(order => {
                        const isExpanded = expandedOrders.has(order.id);
                        
                        return (
                          <React.Fragment key={order.id}>
                            <tr>
                              {getColumnConfig(activeTab)
                                .filter(col => visibleColumns.orders[col.key])
                                .map(col => {
                                  switch(col.key) {
                                    case 'id':
                                      return (
                                        <td key={col.key}>
                                          #{order[col.key]}
                                        </td>
                                      );
                                    case 'order_date':
                                      return (
                                        <td key={col.key}>
                                          {formatDateTime(order[col.key])}
                                        </td>
                                      );
                                    case 'delivery_date':
                                      return (
                                        <td key={col.key}>
                                          {formatDate(order[col.key])}
                                        </td>
                                      );
                                    case 'total_price':
                                      return (
                                        <td key={col.key}>
                                          {parseFloat(order[col.key]).toFixed(2)} ₽
                                        </td>
                                      );
                                    case 'status':
                                      return (
                                        <td key={col.key}>
                                          <span className={getStatusBadge(order.status)}>
                                            {getStatusDisplay(order[col.key])}
                                          </span>
                                        </td>
                                      );
                                    default:
                                      return (
                                        <td key={col.key} className="text-truncate" style={{ maxWidth: '200px' }}>
                                          {order[col.key] || '-'}
                                        </td>
                                      );
                                  }
                                })
                              }

                              {visibleColumns.orders.items && 
                                <td>
                                  <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => toggleOrderExpansion(order.id)}
                                    title={isExpanded ? 'Свернуть товары' : 'Развернуть товары'}
                                  >
                                    <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                  </button>
                                </td>
                              }
                            </tr>
                            
                            {/* Строка с товарами заказа */}
                            {isExpanded && order.items && order.items.length && visibleColumns.orders.items > 0 && (
                              <tr className="order-details-row">
                                <td colSpan={getColumnConfig('orders')
                                  .filter(col => visibleColumns.orders[col.key]).length + 1}
                                >
                                  <div className="order-items-container">
                                    
                                    <div className="table-responsive">
                                      <table className="table table-sm table-bordered">
                                        <thead>
                                          <tr>
                                            <th>Товар</th>
                                            <th>Количество</th>
                                            <th>Цена за ед.</th>
                                            <th>Общая цена</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {order.items.map((item, index) => (
                                            <tr key={index}>
                                              <td>
                                                <div>
                                                  <strong>{item.product_name || 'Товар'}</strong>
                                                  {item.product_unit && (
                                                    <small className="text-muted ms-2">
                                                      ({getUnitDisplay(item.product_unit)})
                                                    </small>
                                                  )}
                                                </div>
                                              </td>
                                              <td>
                                                {parseFloat(item.quantity)}
                                              </td>
                                              <td>
                                                {parseFloat(item.price || item.unit_price || 0).toFixed(2)} ₽
                                              </td>
                                              <td>
                                                <strong>
                                                  {parseFloat(item.total || (item.quantity * (item.price || item.unit_price || 0))).toFixed(2)} ₽
                                                </strong>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      
                                      </table>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                            
                            {isExpanded && (!order.items || order.items.length === 0) && (
                              <tr className="order-details-row">
                                <td colSpan={getColumnConfig('orders')
                                  .filter(col => visibleColumns.orders[col.key]).length + 1}
                                >
                                  <div className="alert alert-warning mb-0">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    Информация о товарах в заказе недоступна
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'products' && filteredProducts.length === 0 && (
                <div className="text-center py-5 empty-data">
                  <i className="bi bi-search display-1 text-muted"></i>
                  <h4 className="mt-3">Товары не найдены</h4>
                  <p className="text-muted">Измените параметры поиска или фильтры</p>
                </div>
              )}

              {activeTab === 'users' && filteredCustomers.length === 0 && (
                <div className="text-center py-5 empty-data">
                  <i className="bi bi-people display-1 text-muted"></i>
                  <h4 className="mt-3">Покупатели не найдены</h4>
                  <p className="text-muted">Измените параметры поиска или фильтры</p>
                </div>
              )}

              {activeTab === 'orders' && filteredOrders.length === 0 && (
                <div className="text-center py-5 empty-data">
                  <i className="bi bi-cart display-1 text-muted"></i>
                  <h4 className="mt-3">Заказы не найдены</h4>
                  <p className="text-muted">Измените параметры поиска или фильтры</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportComponent;
