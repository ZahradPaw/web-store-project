import React, { useState, useEffect } from 'react';
import './SearchBar.css';  

// Компонент строки поиска
const SearchBar = ({
  placeholder = 'Поиск...',
  onSearch,
  delay = 300,
  initialValue = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim() && initialValue === '') {
      onSearch('');
      return;
    }

    const timer = setTimeout(() => {
      onSearch(searchTerm);
      setIsTyping(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay, onSearch, initialValue]);
  
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsTyping(true);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    setIsTyping(false);
  };

  return (
    <form 
      className={`search-bar`}
      onSubmit={handleSubmit}
    >
      <div className="search-bar-container">
        <div className="search-icon">
          <i className="bi bi-search"></i>
        </div>
        
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          aria-label="Поиск"
        />
        
        {searchTerm && (
          <button
            type="button"
            className="clear-button"
            onClick={handleClear}
            aria-label="Очистить поиск"
          >
            <i className="bi bi-x"></i>
          </button>
        )}
        
        {isTyping && (
          <div className="typing-indicator">
            <div className="spinner"></div>
          </div>
        )}
      </div>
      
      <button
        type="submit"
        className="search-button"
        disabled={isTyping}
      >
        Найти
      </button>
    </form>
  );
};

export default SearchBar;