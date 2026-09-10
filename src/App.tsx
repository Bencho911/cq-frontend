import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import Layout from './components/layout/Layout';
import SplashScreen from './components/layout/SplashScreen';
import LiquidTransition from './components/ui/LiquidTransition';

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

const pageVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.28, ease: "easeOut" as any } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeOut" as any } },
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    className="w-full"
  >
    {children}
  </motion.div>
);

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showLiquid, setShowLiquid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const t1 = setTimeout(() => setShowLiquid(true), 2000);
    const t2 = setTimeout(() => setShowSplash(false), 2800);
    const t3 = setTimeout(() => setShowLiquid(false), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>
      <AnimatePresence>
        {showLiquid && <LiquidTransition key="liquid" />}
      </AnimatePresence>

      <Layout>
        <AnimatePresence mode="wait">
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
            <Route path="/loyalty" element={<PageWrapper><LoyaltyProgram /></PageWrapper>} />
            <Route path="/privacy" element={<PageWrapper><PrivacySecurity /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </>
  );
}

export default App;
