import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { login, logout, getProfile } from '../endpoints/api';

// Контекст для получения данных аутентификации
const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuthContext must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Извлечение данных о пользователе и аутентификации
  const fetchAuthData = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    const res = await getProfile();

    if (token && res.success) {
      setIsAuthenticated(true);
      setUser(res.data);
    }
    else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAuthData();
  }, [isAuthenticated]);

  // Вход в аккаунт
  const userLogin = async (credentials) => {
    setLoading(true);
    const result = await login(credentials);
    if (result.success)
      setIsAuthenticated(true);
    else
      setIsAuthenticated(false);
    setLoading(false);

    return result;
  }

  // Выход из аккаунта
  const userLogout = () => {
    logout();
    setIsAuthenticated(false);
    setUser(null);
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    userLogin,
    userLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
