import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';

// Layout Shared Components
import Header from './component/Header';
import Footer from './component/Footer';
import { ToastContainer } from './component/molecule/Toast/ToastContainer';

// Pages
import Home from './page/Home';
import Menu from './page/Menu';
import DishDetail from './page/DishDetail';
import About from './page/About';
import Checkout from './page/Checkout';
import Orders from './page/Orders';
import Profile from './page/Profile';
import Auth from './page/Auth';
import Survey from './page/Survey';
import AiRecommendation from './page/AiRecommendation';

import { GlobalNotification } from './component/molecule/Notification/GlobalNotification';
import { NotificationWatcher } from './component/molecule/Notification/NotificationWatcher';

// App.css import
import './App.css';

// Initialize Tanstack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AppProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </AppProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

function AppShell() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="flex flex-col min-h-screen bg-bg-main text-text-main transition-colors duration-300">
      <ScrollToTop />
      {!isAuthPage && <Header />}

      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/dish/:id" element={<DishDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ai-recommendation" element={<AiRecommendation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAuthPage && <GlobalNotification />}
      {!isAuthPage && <NotificationWatcher />}
      <ToastContainer />
      {!isAuthPage && <Footer />}
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

export default App;
