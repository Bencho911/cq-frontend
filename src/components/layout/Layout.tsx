import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

/** Rutas principales con barra de navegación inferior. */
const TAB_PATHS = ['/home', '/menu', '/orders', '/profile'];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const showBottomNav = TAB_PATHS.includes(location.pathname);

  return (
    <div className="min-h-[100dvh] bg-cream-deep sm:bg-cream">
      <div className="mx-auto flex min-h-[100dvh] w-full flex-col bg-cream sm:max-w-[400px] sm:shadow-lift">
        <main className="relative z-0 flex-1 overflow-x-hidden">{children}</main>
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
};

export default Layout;
