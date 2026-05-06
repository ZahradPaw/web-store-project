import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import PrivateRoute from './routes/PrivateRoute';
import StaffRoute from './routes/StaffRoute';
import Header from './components/Layout/Header';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductsCatalogPage from './pages/ProductsCatalogPage';
import ProductsPage from './pages/ProductsPage';
import ProductEditPage from './pages/ProductEditPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import CustomersPage from './pages/CustomersPage';
import CustomerEditPage from './pages/CustomerEditPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import OrdersManagerPage from './pages/OrdersManagerPage';
import OrderEditPage from './pages/OrderEditPage';
import OrderCreatePage from './pages/OrderCreatePage';
import StaffListPage from './pages/StaffListPage';
import StaffEditPage from './pages/StaffEditPage';
import LoyaltySettingsPage from './pages/LoyaltySettingsPage';
import ReportPage from './pages/ReportPage';

const AppContent = () => {
  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <Header />
        <main>
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/" element={<ProductsCatalogPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/product/:id/:slug" element={<ProductDetailPage />} />

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
                <StaffRoute>
                  <ProductsPage />
                </StaffRoute>
              }
            />
            <Route
              path="/products/detail/:id"
              element={
                <StaffRoute>
                  <ProductEditPage />
                </StaffRoute>
              }
            />
            <Route
              path="/customers/list"
              element={
                <StaffRoute>
                  <CustomersPage />
                </StaffRoute>
              }
            />
            <Route
              path="/customers/detail/:id"
              element={
                <StaffRoute>
                  <CustomerEditPage />
                </StaffRoute>
              }
            />
            <Route
              path="/customer/:id"
              element={
                <StaffRoute>
                  <CustomerDetailPage />
                </StaffRoute>
              }
            />
            <Route
              path="/orders/list"
              element={
                <StaffRoute>
                  <OrdersManagerPage />
                </StaffRoute>
              }
            />
            <Route
              path="/orders/detail/:id"
              element={
                <StaffRoute>
                  <OrderEditPage />
                </StaffRoute>
              }
            />
            <Route
              path="/orders/create"
              element={
                <StaffRoute>
                  <OrderCreatePage />
                </StaffRoute>
              }
            />
            <Route
              path="/staff/list"
              element={
                <StaffRoute>
                  <StaffListPage />
                </StaffRoute>
              }
            />
            <Route
              path="/staff/detail/:id"
              element={
                <StaffRoute>
                  <StaffEditPage />
                </StaffRoute>
              }
            />
            <Route
              path="/loyalty-settings"
              element={
                <StaffRoute>
                  <LoyaltySettingsPage />
                </StaffRoute>
              }
            />
            <Route
              path="/report"
              element={
                <StaffRoute>
                  <ReportPage />
                </StaffRoute>
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
