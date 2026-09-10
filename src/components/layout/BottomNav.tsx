import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, UtensilsCrossed, ClipboardList, User } from 'lucide-react';

const navItems = [
  { to: '/home', icon: Home, label: 'Inicio' },
  { to: '/menu', icon: UtensilsCrossed, label: 'Menú' },
  { to: '/orders', icon: ClipboardList, label: 'Historial' },
  { to: '/profile', icon: User, label: 'Perfil' },
];

// Rutas donde el BottomNav debe ocultarse (flujos full-screen)
const HIDDEN_ROUTES = [
  '/checkout',
  '/checkout-loading',
  '/track-order',
  '/order-details',
  '/order-success',
  '/payment-method',
  '/vouchers',
  '/stores',
  '/invoice',
  '/notifications',
  '/rating-review',
  '/onboarding',
  '/login',
  '/register',
  '/input-pin',
  '/otp-loading',
  '/confirm-otp',
  '/create-pin',
  '/account-loading',
];

const BottomNav = () => {
  const location = useLocation();
  const isHidden = HIDDEN_ROUTES.some((r) => location.pathname.startsWith(r));

  return (
    <AnimatePresence>
      {!isHidden && (
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          aria-label="Navegación principal"
          className="fixed bottom-0 left-0 right-0 z-[40] mx-auto max-w-[430px] border-t border-line bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
          style={{ boxShadow: 'var(--shadow-nav)' }}
        >
          <div className="flex h-[64px] items-center justify-around px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                aria-label={item.label}
                className="relative flex w-16 flex-col items-center justify-center gap-1 rounded-xl py-1"
              >
                {({ isActive }) => (
                  <>
                    {/* Indicador de posición animado */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl bg-brand-soft"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <motion.div
                      whileTap={{ scale: 0.85 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="relative z-10 flex flex-col items-center gap-1"
                    >
                      <item.icon
                        size={22}
                        strokeWidth={isActive ? 2.5 : 1.8}
                        className={`transition-colors duration-200 ${isActive ? 'text-brand' : 'text-muted-soft'}`}
                        aria-hidden
                      />
                      <span
                        className={`text-[10px] font-semibold tracking-tight transition-colors duration-200 ${
                          isActive ? 'text-brand' : 'text-muted-soft'
                        }`}
                      >
                        {item.label}
                      </span>
                    </motion.div>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default BottomNav;
