import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import './index.css';
import App from './App.tsx';
import { CartProvider } from './lib/cart';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
        <Toaster
          position="top-center"
          closeButton
          toastOptions={{
            // Avisos en azul tinta, como el resto de la app.
            style: { background: 'var(--color-ink)', color: '#fff', border: 'none', borderRadius: 6, fontFamily: 'var(--font-sans)', fontSize: 15 },
            classNames: { description: '!text-[#D7ECE9] !text-[14px]', closeButton: '!bg-white !text-ink !border-0' },
          }}
        />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);
