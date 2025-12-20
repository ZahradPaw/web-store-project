import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

import Header from './components/Layout/Header';
import PrivateRoute from './components/PrivateRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductsManagerPage from './pages/ProductsManagerPage';
import ProductDetailManagerPage from './pages/ProductDetailManagerPage';
import ProductCreatePage from './pages/ProductCreatePage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import CustomerCreatePage from './pages/CustomerCreatePage';
import OrdersManagerPage from './pages/OrdersManagerPage';
import OrderDetailManagerPage from './pages/OrderDetailManagerPage';
import OrderCreatePage from './pages/OrderCreatePage';
import StaffListPage from './pages/StaffListPage';
import StaffDetailPage from './pages/StaffDetailPage';
import StaffCreatePage from './pages/StaffCreatePage';
import LoyaltySettingsPage from './pages/LoyaltySettingsPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const AppContent = () => {
  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <Header />
        <main>
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/" element={<ProductsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />

            {/* Маршруты для всех авторизованных */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />

            {/* Маршруты для клиентов */}
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <OrdersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <PrivateRoute>
                  <OrderDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <CartPage />
                </PrivateRoute>
              }
            />

            {/* Маршруты для персонала */}
            <Route
              path="/products/list"
              element={
                <PrivateRoute>
                  <ProductsManagerPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/products/detail/:id"
              element={
                <PrivateRoute>
                  <ProductDetailManagerPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/products/create"
              element={
                <PrivateRoute>
                  <ProductCreatePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/customers/list"
              element={
                <PrivateRoute>
                  <CustomersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/customers/detail/:id"
              element={
                <PrivateRoute>
                  <CustomerDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/customers/register"
              element={
                <PrivateRoute>
                  <CustomerCreatePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders/list"
              element={
                <PrivateRoute>
                  <OrdersManagerPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders/detail/:id"
              element={
                <PrivateRoute>
                  <OrderDetailManagerPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders/create"
              element={
                <PrivateRoute>
                  <OrderCreatePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/staff/list"
              element={
                <PrivateRoute>
                  <StaffListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/staff/detail/:id"
              element={
                <PrivateRoute>
                  <StaffDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/staff/register"
              element={
                <PrivateRoute>
                  <StaffCreatePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/loyalty-settings"
              element={
                <PrivateRoute>
                  <LoyaltySettingsPage />
                </PrivateRoute>
              }
            />

            {/* Перенаправление */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App; 
