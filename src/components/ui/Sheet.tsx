import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../lib/cn';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Si es true, ocupa casi todo el alto (detalle de producto); si no, bottom-sheet. */
  fullscreen?: boolean;
  className?: string;
}

/** Cierra con la tecla Escape. */
function useEscape(onClose: () => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enabled, onClose]);
}

export function Sheet({ open, onClose, children, fullscreen = false, className }: SheetProps) {
  useEscape(onClose, open);

  const content = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/40"
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: fullscreen ? '100%' : 40, opacity: fullscreen ? 1 : 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: fullscreen ? '100%' : 40, opacity: fullscreen ? 1 : 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className={cn(
              'relative z-10 flex w-full flex-col bg-cream',
              fullscreen
                ? 'h-full max-h-full sm:h-auto sm:max-h-[90dvh] sm:max-w-[400px] sm:rounded-t-3xl'
                : 'max-h-[85dvh] max-w-[400px] rounded-t-3xl',
              className,
            )}
          >
            {fullscreen && (
              <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-line" aria-hidden />
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
}
