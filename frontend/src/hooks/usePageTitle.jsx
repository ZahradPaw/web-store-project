import React, { useEffect } from 'react';

// Кастомный хук для установки заголовков для страниц
const usePageTitle = (title, description = '', keywords = '') => {

  useEffect(() => {
    // Установка заголовка
    document.title = title ? `${title} - Магазин` : 'Магазин';
    
    // Обновление мета-тегов
    const updateMetaTag = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    
    // Описание страницы
    if (description) {
      updateMetaTag('description', description);
    }
    
    // Ключевые слова
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }
    
    // Open Graph мета-теги
    const updateOgTag = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    
    updateOgTag('og:title', title ? `${title} | Магазин` : 'Магазин');
    if (description) {
      updateOgTag('og:description', description);
    }
    
    // Восстановление заголовка при размонтировании
    return () => {
      document.title = 'Магазин';
    };
  }, [title, description, keywords]);
};

export default usePageTitle;
