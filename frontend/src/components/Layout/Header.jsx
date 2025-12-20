import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import './Header.css'

// Компонент заголовка страницы
const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-container">
        <div className="d-flex justify-content-between align-items-center py-3">
          {/* Логотип */}
          <div className="d-flex align-items-center">
            <h1 
              className="logo" 
              onClick={() => navigate('/')}
            >
              Магазин
            </h1>
          </div>

          {/* Навигация */}
          <Navigation />
        </div>
      </div>
    </header>
  );
}

export default Header; 
