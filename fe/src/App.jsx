import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './context/AppContext';

// Layout Shared Components
import Header from './component/Header';
import Footer from './component/Footer';
import Minicart from './component/Minicart';

// Pages
import Menu from './page/Menu';
import DishDetail from './page/DishDetail';
import About from './page/About';
import Checkout from './page/Checkout';
import Orders from './page/Orders';
import Profile from './page/Profile';
import Auth from './page/Auth';
import Survey from './page/Survey';

import { DraftNotification } from './component/molecule/Checkout/DraftNotification';

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
      <AppProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-bg-main text-text-main transition-colors duration-300">
            {/* Header */}
            <Header />

            {/* Main Content Area */}
            <main className="grow">
              <Routes>
                {/* Public Shop Menu is landing page */}
                <Route path="/" element={<Menu />} />
                
                {/* Dish Detail */}
                <Route path="/dish/:id" element={<DishDetail />} />
                
                {/* About & Operational Process */}
                <Route path="/about" element={<About />} />
                
                {/* Auth: Login/Register */}
                <Route path="/auth" element={<Auth />} />
                
                {/* Survey Onboarding */}
                <Route path="/survey" element={<Survey />} />
                
                {/* Checkout Page */}
                <Route path="/checkout" element={<Checkout />} />
                
                {/* Orders tracking */}
                <Route path="/orders" element={<Orders />} />
                
                {/* Profile Dashboard */}
                <Route path="/profile" element={<Profile />} />

                {/* Fallback redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Minicart Slide Drawer */}
            <Minicart />

            {/* Global Draft Checkout Notification */}
            <DraftNotification />

            {/* Footer */}
            <Footer />
          </div>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
