import axios from 'axios';

// Базовый URL API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Эндпоинты JWT токенов
const TOKEN_URL = '/auth/token/';
const REFRESH_TOKEN_URL = '/auth/token/refresh/';

// Эндпоинты пользователей
const REGISTER_URL = '/users/register/';
const USERS_LIST_URL = '/users/list/';
const PROFILE_URL = '/users/profile/';
const USER_DETAILS_URL = '/users/user/';

// Эндпоинты продуктов
const PRODUCTS_LIST_URL = '/products/';

// Эндпоинты заказов
const ORDERS_LIST_URL = '/orders/';

// Эндпоинты настроек лояльности
const LOYALTY_SETTINGS_URL = '/loyalty/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Интерцептор для добавления JWT токена к запросам
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token)
      config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок и обновления JWT токена
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 или 403 и это не запрос на обновление токена
    if ((error.response?.status === 401 || error.response?.status === 403)
      && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Попытка обновления JWT токена
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}${REFRESH_TOKEN_URL}`, {
            refresh: refreshToken,
          });
          const newAccessToken = response.data.access;
          localStorage.setItem('accessToken', newAccessToken);

          // Повторение оригинального запроса с обновленным JWT токеном
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Если обновление не удалось, разлогиниваем пользователя
        logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Получение данных при успешном запросе
const getResponseDataSuccess = (response) => {
  return {
    success: true,
    data: response.data,
  };
}

// Получение данных при неуспешном запросе с возвартом сообщения об ошибке или деталей ошибки
const getResponseDataFailed = (error) => {
  if (error.response?.data !== undefined) {
    return {
      success: false,
      error: error.response.data.detail || error.response.data
    }
  }
  return {
    success: false,
    error: error.message
  };
}

// Вход пользователя по JWT токенам
export const login = async (credentials) => {
  try {
    const response = await apiClient.post(TOKEN_URL, credentials);

    // Сохраняем JWT токены в localStorage
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);

    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Выход пользователя путем удаления JWT токенов
export const logout = () => {
  // Очистка токенов
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

// Регистрация нового пользователя
export const register = async (userData) => {
  try {
    const response = await apiClient.post(REGISTER_URL, userData);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Получение списка пользователей 
export const getUsers = async () => {
  try {
    const response = await apiClient.get(USERS_LIST_URL);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Получение профиля текущего пользователя
export const getProfile = async () => {
  try {
    const response = await apiClient.get(PROFILE_URL);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Получение пользователя по ID
export const getUser = async (userID) => {
  try {
    const response = await apiClient.get(`${USER_DETAILS_URL}${userID}/`);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}


// Изменение данных пользователя по ID
export const updateUser = async (userID, userData) => {
  try {
    const response = await apiClient.put(`${USER_DETAILS_URL}${userID}/`, userData);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Удаление пользователя по ID
export const deleteUser = async (userID) => {
  try {
    const response = await apiClient.delete(`${USER_DETAILS_URL}${userID}/`);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Получение списка продуктов 
export const getProducts = async () => {
  try {
    const response = await apiClient.get(PRODUCTS_LIST_URL);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Получение продукта по ID
export const getProduct = async (productID) => {
  try {
    const response = await apiClient.get(`${PRODUCTS_LIST_URL}${productID}/`);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Создание нового продукта
export const createProduct = async (productData) => {
  try {
    const response = await apiClient.post(PRODUCTS_LIST_URL, productData);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Обновление продукта
export const updateProduct = async (productId, productData) => {
  try {
    const response = await apiClient.patch(`${PRODUCTS_LIST_URL}${productId}/`, productData);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Удаление продукта 
export const deleteProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`${PRODUCTS_LIST_URL}${productId}/`);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Получение списка заказов
export const getOrders = async () => {
  try {
    const response = await apiClient.get(ORDERS_LIST_URL);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Получение заказа
export const getOrder = async (orderID) => {
  try {
    const response = await apiClient.get(`${ORDERS_LIST_URL}${orderID}/`);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Получение заказов по ID клиента
export const getCustomerOrders = async (customerID) => {
  try {
    const response = await apiClient.get(`${ORDERS_LIST_URL}?client=${customerID}`);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Создание нового заказа
export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post(ORDERS_LIST_URL, orderData);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Обновление заказа
export const updateOrder = async (orderID, orderData) => {
  try {
    const response = await apiClient.patch(`${ORDERS_LIST_URL}${orderID}/`, orderData);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Отмена заказа
export const cancelOrder = async (orderID) => {
  try {
    const response = await apiClient.get(`${ORDERS_LIST_URL}${orderID}/mark_cancelled/`);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Подтверждение заказа
export const markOrderComfirmed = async (orderID) => {
  try {
    const response = await apiClient.get(`${ORDERS_LIST_URL}${orderID}/mark_confirmed/`);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Отметка, что заказ доставлен
export const markOrderDelivered = async (orderID) => {
  try {
    const response = await apiClient.get(`${ORDERS_LIST_URL}${orderID}/mark_delivered/`);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Получение настроек лояльности
export const getLoyaltySettings = async () => {
  try {
    const response = await apiClient.get(LOYALTY_SETTINGS_URL);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}

// Обновление настроек лояльности
export const updateLoyaltySettings = async (settingsData) => {
  try {
    const response = await apiClient.post(LOYALTY_SETTINGS_URL, settingsData);
    return getResponseDataSuccess(response);
  } catch (error) {
    return getResponseDataFailed(error);
  }
}
