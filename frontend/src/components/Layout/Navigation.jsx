import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useCartContext } from '../../contexts/CartContext';
import { getRoleDisplay } from '../../utils/user';

// Компонент меню навигации
const Navigation = () => {
  const { isAuthenticated, user, userLogout } = useAuthContext();
  const { getCartItemsCount } = useCartContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Провека текущего активного пути
  const isActive = (path) => {
    return location.pathname === path ? 'text-warning' : 'text-light';
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // Выход из аккаунта и перенаправление на страницу входа
  const handleLogout = () => {
    userLogout();
    navigate('/login');
  };

  const cartItemsCount = getCartItemsCount();

  // Панель с именем и фамилией пользователя, ролью и кнопкой выхода из аккаунта
  const AccountPanel = () => {
    return (
      <div className="username-panel d-flex align-items-center">
        <span className="text-light me-3">
          {user?.first_name || user?.username} {user?.last_name} | {getRoleDisplay(user.role)}
        </span>
        <button
          onClick={handleLogout}
          className="btn btn-outline-light btn-sm log-button"
        >
          Выйти
        </button>
      </div>
    );
  }

  // Меню для неавтоизованных
  if (!isAuthenticated || !user) {
    return (
      <nav className="d-flex align-items-center">
        <div className="d-flex me-4">
          <Link
            to="/"
            className={`nav-link me-3 ${isActive('/')}`}
          >
            Каталог
          </Link>
        </div>
        <div className="d-flex align-items-center">
          <button
            onClick={handleLogin}
            className="btn btn-outline-light btn-sm log-button"
          >
            Войти
          </button>
        </div>
      </nav>
    );
  }

  // Меню для клиентов
  if (user.role === 'client')
    return (
      <nav className="d-flex align-items-center">
        <div className="d-flex me-4">
          <Link
            to="/"
            className={`nav-link me-3 ${isActive('/')}`}
          >
            Каталог
          </Link>
          <Link
            to="/cart"
            className={`nav-link me-3 ${isActive('/cart')}`}
          >
            Корзина
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </Link>
          <Link
            to="/orders"
            className={`nav-link me-3 ${isActive('/orders')}`}
          >
            Мои заказы
          </Link>
          <Link
            to="/profile"
            className={`nav-link me-3 ${isActive('/profile')}`}
          >
            Личный кабинет
          </Link>
        </div>

        <AccountPanel />
      </nav>
    );

  // Меню для товароведов
  if (user.role == 'merchandiser') {
    return (
      <nav className="d-flex align-items-center">
        <div className="d-flex me-4">
          <Link
            to="/products/list"
            className={`nav-link me-3 ${isActive('/products/list')}`}
          >
            Товары
          </Link>
          <Link
            to="/profile"
            className={`nav-link me-3 ${isActive('/profile')}`}
          >
            Личный кабинет
          </Link>
        </div>

        <AccountPanel />
      </nav>
    );
  }

  // Меню для клиент-менеджеров
  if (user.role == 'account_manager') {
    return (
      <nav className="d-flex align-items-center">
        <div className="d-flex me-4">
          <Link
            to="/customers/list"
            className={`nav-link me-3 ${isActive('/customers/list')}`}
          >
            Покупатели
          </Link>
          <Link
            to="/profile"
            className={`nav-link me-3 ${isActive('/profile')}`}
          >
            Личный кабинет
          </Link>
        </div>

        <AccountPanel />
      </nav>
    );
  }

  // Меню для продавцов
  if (user.role == 'salesperson') {
    return (
      <nav className="d-flex align-items-center">
        <div className="d-flex me-4">
          <Link
            to="/orders/list"
            className={`nav-link me-3 ${isActive('/orders/list')}`}
          >
            Заказы
          </Link>
          <Link
            to="/orders/create"
            className={`nav-link me-3 ${isActive('/orders/create')}`}
          >
            Оформить продажу
          </Link>
          <Link
            to="/profile"
            className={`nav-link me-3 ${isActive('/profile')}`}
          >
            Личный кабинет
          </Link>
        </div>

        <AccountPanel />
      </nav>
    );
  }

  // Меню для директора
  if (user.role == 'director') {
    return (
      <nav className="d-flex align-items-center">
        <div className="d-flex me-4">
          <Link
            to="/report"
            className={`nav-link me-3 ${isActive('/report')}`}
          >
            Отчеты
          </Link>
          <Link
            to="/profile"
            className={`nav-link me-3 ${isActive('/profile')}`}
          >
            Личный кабинет
          </Link>
        </div>

        <AccountPanel />
      </nav>
    );
  }

  // Меню для администратора
  if (user.role == 'admin') {
    return (
      <nav className="d-flex align-items-center">
        <div className="d-flex me-4">
          <Link
            to="/products/list"
            className={`nav-link me-3 ${isActive('/products/list')}`}
          >
            Товары
          </Link>
          <Link
            to="/customers/list"
            className={`nav-link me-3 ${isActive('/customers/list')}`}
          >
            Покупатели
          </Link>
          <Link
            to="/orders/list"
            className={`nav-link me-3 ${isActive('/orders/list')}`}
          >
            Заказы
          </Link>
          <Link
            to="/staff/list"
            className={`nav-link me-3 ${isActive('/staff/list')}`}
          >
            Сотрудники
          </Link>
          <Link
            to="/loyalty-settings"
            className={`nav-link me-3 ${isActive('/loyalty-settings')}`}
          >
            Настройки лояльности
          </Link>
          <Link
            to="/profile"
            className={`nav-link me-3 ${isActive('/profile')}`}
          >
            Личный кабинет
          </Link>
        </div>

        <AccountPanel />
      </nav>
    );
  }
}

export default Navigation; 
