import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import BikeLoader from './components/BikeLoader';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import SellBikePage from './pages/SellBikePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  const [appReady, setAppReady] = useState(() => {
    try {
      return sessionStorage.getItem('sm_loaded') === 'true';
    } catch {
      return false;
    }
  });

  const handleLoaderComplete = () => {
    try {
      sessionStorage.setItem('sm_loaded', 'true');
    } catch {
      // ignore quota / storage errors
    }
    setAppReady(true);
  };

  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        {!appReady ? (
          <motion.div
            key="loader"
            exit={{ opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <BikeLoader onComplete={handleLoaderComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="app-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <BrowserRouter>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: { background: '#ffffff', color: '#1C1C1E', border: '1px solid #E5E4E0', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
                }}
              />
              <Routes>
                {/* Public pages with layout */}
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/inventory" element={<Layout><InventoryPage /></Layout>} />
                <Route path="/inventory/:id" element={<Layout><VehicleDetailPage /></Layout>} />
                <Route path="/about" element={<Layout><AboutPage /></Layout>} />
                <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
                <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
                <Route path="/sell" element={<Layout><SellBikePage /></Layout>} />

                {/* Admin (no layout) */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              </Routes>
            </BrowserRouter>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthProvider>
  );
}
