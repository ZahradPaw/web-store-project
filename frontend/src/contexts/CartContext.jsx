import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Контекст для работы корзины для формирования заказа
const CartContext = createContext();

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error('useCart must be used within a CartProvider');
  return context;
};

// Типы действий для корзины
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Редуктор для управления состоянием корзины
const cartReducer = (state, action) => {
  switch (action.type) {

    // Добавление товара в корзину
    case CART_ACTIONS.ADD_ITEM:
      const existingItem = state.items.find(item =>
        item.product.id === action.payload.product.id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload]
      };

    // Удаление товара из корзины
    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.payload)
      };

    // Обновление кол-ва товара в корзине
    case CART_ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    // Очистка корзины
    case CART_ACTIONS.CLEAR_CART:
      return {
        items: [],
        total: 0
      };

    // Загрузка корзины
    case CART_ACTIONS.LOAD_CART:
      return action.payload;

    default:
      return state;
  }
};

const initialState = {
  items: [],
  total: 0
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Загрузка корзины из localStorage при монтировании
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch({ type: CART_ACTIONS.LOAD_CART, payload: JSON.parse(savedCart) });
    }
  }, []);

  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Расчет общей суммы
  useEffect(() => {
    const total = cart.items.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * parseFloat(item.quantity));
    }, 0);

    dispatch({ type: CART_ACTIONS.LOAD_CART, payload: { ...cart, total } });
  }, [cart.items]);

  // Добавление товара в корзину
  const addToCart = (product, quantity) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity: parseFloat(quantity) }
    });
  };

  // Удаление товара из корзины
  const removeFromCart = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
  };

  // Обновление кол-ва товара 
  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity: parseFloat(quantity) }
    });
  };

  // Очистка корзины
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Получение кол-ва товаров в корзине
  const getCartItemsCount = () => {
    return cart.items.length;
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
