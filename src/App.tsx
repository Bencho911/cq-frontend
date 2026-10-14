import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import Layout from './components/layout/Layout';
import SplashScreen from './components/layout/SplashScreen';

// Auth / Onboarding
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import InputPIN from './pages/InputPIN';
import Register from './pages/Register';
import OTPLoading from './pages/OTPLoading';
import ConfirmOTP from './pages/ConfirmOTP';
import CreatePIN from './pages/CreatePIN';
import AccountLoading from './pages/AccountLoading';

// Main app
import Home from './pages/Home';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Stores from './pages/Stores';
import Notifications from './pages/Notifications';

// Checkout flow
import Checkout from './pages/Checkout';
import CheckoutLoading from './pages/CheckoutLoading';
import OrderSuccess from './pages/OrderSuccess';
import OrderDetails from './pages/OrderDetails';
import TrackOrder from './pages/TrackOrder';
import Invoice from './pages/Invoice';
import LoyaltyProgram from './pages/LoyaltyProgram';
import PrivacySecurity from './pages/PrivacySecurity';

// Extra
import RatingReview from './pages/RatingReview';
import PaymentMethod from './pages/PaymentMethod';
import Vouchers from './pages/Vouchers';

// Solo un fundido corto de entrada. Sin animación de salida: con
// `mode="wait"` cada navegación esperaba ~480 ms antes de mostrar la
// siguiente pantalla, y las pestañas se tocan decenas de veces al día.
const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] } },
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="animate"
    variants={pageVariants}
    className="w-full"
  >
    {children}
  </motion.div>
);

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Antes: splash + transición líquida = 4 s antes de poder usar la app.
    const t = setTimeout(() => setShowSplash(false), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>

      <Layout>
          <Routes location={location} key={location.pathname}>
            {/* Redirect root */}
            <Route path="/" element={<Navigate to="/onboarding" replace />} />

            {/* ── Onboarding / Auth ── */}
            <Route path="/onboarding" element={<PageWrapper><Onboarding /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/input-pin" element={<PageWrapper><InputPIN /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            <Route path="/otp-loading" element={<PageWrapper><OTPLoading /></PageWrapper>} />
            <Route path="/confirm-otp" element={<PageWrapper><ConfirmOTP /></PageWrapper>} />
            <Route path="/create-pin" element={<PageWrapper><CreatePIN /></PageWrapper>} />
            <Route path="/account-loading" element={<PageWrapper><AccountLoading /></PageWrapper>} />

            {/* ── Main app ── */}
            <Route path="/home" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/menu" element={<PageWrapper><Menu /></PageWrapper>} />
            <Route path="/orders" element={<PageWrapper><Orders /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
            <Route path="/stores" element={<PageWrapper><Stores /></PageWrapper>} />
            <Route path="/notifications" element={<PageWrapper><Notifications /></PageWrapper>} />

            {/* ── Checkout flow ── */}
            <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
            <Route path="/checkout-loading" element={<PageWrapper><CheckoutLoading /></PageWrapper>} />
            <Route path="/order-success" element={<PageWrapper><OrderSuccess /></PageWrapper>} />
            <Route path="/order-details" element={<PageWrapper><OrderDetails /></PageWrapper>} />
            <Route path="/track-order" element={<PageWrapper><TrackOrder /></PageWrapper>} />
            <Route path="/invoice/:id" element={<PageWrapper><Invoice /></PageWrapper>} />

            {/* ── Extra ── */}
            <Route path="/rating-review" element={<PageWrapper><RatingReview /></PageWrapper>} />
            <Route path="/payment-method" element={<PageWrapper><PaymentMethod /></PageWrapper>} />
            <Route path="/vouchers" element={<PageWrapper><Vouchers /></PageWrapper>} />
            <Route path="/album" element={<PageWrapper><LoyaltyProgram /></PageWrapper>} />
            <Route path="/loyalty" element={<Navigate to="/album" replace />} />
            <Route path="/privacy" element={<PageWrapper><PrivacySecurity /></PageWrapper>} />
          </Routes>
      </Layout>
    </>
  );
}

export default App;
