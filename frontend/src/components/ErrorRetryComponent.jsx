import React, { useEffect, useState } from "react";

// Компонент отображения текста ошибки с возможностью перезагрузки
const ErrorRetryComponent = ({ error, onClick }) => {
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    updateErrorText();
  }, [error]);

  // Обновление текста ошибки
  const updateErrorText = () => {
    if (typeof(error) == 'object') {
      setErrorMsg(JSON.stringify(error));
    }
    else {
      setErrorMsg(error); 
    }
  }

  return (
    <div className="alert alert-danger" role="alert">
      <h4 className="alert-heading">Ошибка загрузки</h4>
      {errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}
      <button className="btn btn-outline-danger" onClick={onClick}>
        Попробовать снова
      </button>
    </div>
  );
}

export default ErrorRetryComponent; 
