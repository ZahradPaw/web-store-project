import React from 'react';

// Компонент загрузки
const LoadingComponent = ({ text }) => {
  return (
    <div className="container py-4">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p>{text ? text : 'Загрузка...'}</p>
      </div>
    </div>
  );
}

export default LoadingComponent; 
