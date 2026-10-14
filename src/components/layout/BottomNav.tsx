import { NavLink } from 'react-router-dom';
import { BookOpen, ClipboardList, Coffee, Home } from 'lucide-react';

const navItems = [
  { to: '/home', icon: Home, label: 'Inicio' },
  { to: '/menu', icon: Coffee, label: 'Menú' },
  { to: '/album', icon: BookOpen, label: 'Álbum' },
  { to: '/orders', icon: ClipboardList, label: 'Pedidos' },
];

/**
 * Barra de pestañas en azul tinta. Sin animación de entrada ni indicador
 * deslizante: se toca decenas de veces al día y debe responder al instante.
 * La cuenta se abre desde el avatar de Inicio.
 */
const BottomNav = () => (
  <nav
    aria-label="Navegación principal"
    className="fixed bottom-0 left-0 right-0 z-[40] mx-auto max-w-[400px] bg-ink pb-[env(safe-area-inset-bottom)]"
  >
    <div className="flex h-[64px] items-center justify-around px-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className="flex min-h-[48px] w-[72px] flex-col items-center justify-center gap-1"
        >
          {({ isActive }) => (
            <>
              <item.icon
                size={22}
                strokeWidth={isActive ? 2.4 : 1.8}
                className={isActive ? 'text-white' : 'text-[#A9B8BF]'}
                aria-hidden
              />
              <span className={`text-[12px] ${isActive ? 'font-bold text-white' : 'text-[#A9B8BF]'}`}>{item.label}</span>
              <span className={`h-[3px] w-[18px] rounded-full ${isActive ? 'bg-mostaza' : 'bg-transparent'}`} aria-hidden />
            </>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default BottomNav;
