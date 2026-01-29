import React from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useCartContext } from '../contexts/CartContext';
import Cart from '../components/Cart/Cart';
import usePageTitle from '../hooks/usePageTitle';

// Страница корзины с выбранными товарами
const CartPage = () => {
  const { user } = useAuthContext(); 
  const { cart, clearCart } = useCartContext();

  usePageTitle('Корзина');
  
  return (
    <div className="container py-4">
      <Cart 
        user={user}
        cart={cart}
        clearCart={clearCart}
      />
    </div>
  );
};

export default CartPage;
