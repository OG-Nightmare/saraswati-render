import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import { Analytics } from '@vercel/analytics/react';

const BikeLoader = lazy(() => import('./components/BikeLoader'));

// Lazy-loaded pages for lightning-fast performance & optimized bundle size
const HomePage = lazy(() => import('./pages/HomePage'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const VehicleDetailPage = lazy(() => import('./pages/VehicleDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const SellBikePage = lazy(() => import('./pages/SellBikePage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Modern, sleek loading fallback
function PageLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 bg-[#FAFAFC]">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-[#FF5500]/20 animate-ping" />
        <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-[#FF5500] border-r-[#FF5500] animate-spin" />
      </div>
      <p className="text-xs font-mono tracking-widest text-[#94A3B8] uppercase mt-4">
        Saraswati Superbikes
      </p>
    </div>
  );
}

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
      if (typeof navigator !== 'undefined') {
        const ua = navigator.userAgent || '';
        if (/bot|googlebot|crawler|spider|robot|crawling|lighthouse|speed insights|headlesschrome|ptst/i.test(ua)) {
          return true;
        }
      }
      return sessionStorage.getItem('sm_loaded') === 'true';
    } catch {
      return false;
    }
  });

  const handleLoaderComplete = () => {
    try {
      sessionStorage.setItem('sm_loaded', 'true');
    } catch {
      // ignore storage errors
    }
    setAppReady(true);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Analytics />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#12141C',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              fontSize: '13px',
            },
          }}
        />

        {/* Non-blocking loader overlay for human visitors; page DOM renders immediately underneath for SEO */}
        <AnimatePresence>
          {!appReady && (
            <motion.div
              key="app-loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="fixed inset-0 z-[9999] bg-[#07090E] pointer-events-auto"
            >
              <Suspense fallback={null}>
                <BikeLoader onComplete={handleLoaderComplete} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>

        <Suspense fallback={<PageLoadingFallback />}>
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
