import React, { useEffect, useState } from "react";
import { formatJsonToString } from "../utils/utils";

// Компонент отображения текста ошибки
const ErrorComponent = ({ error }) => {
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    updateErrorText();
  }, [error]);

  // Обновление текста ошибки
  const updateErrorText = () => {
    if (typeof(error) == 'object') {
      setErrorMsg(formatJsonToString(error));
    }
    else {
      setErrorMsg(error); 
    }
  }

  return (
    <div>
      {errorMsg && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {errorMsg}
        </div>
      )}
    </div>
  );
}

export default ErrorComponent; 
