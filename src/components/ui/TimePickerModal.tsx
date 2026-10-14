import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (time: string) => void;
}

const SLOT_MINUTES = 15;
/**
 * MOCK: la tienda aún no informa su horario ni su capacidad, así que se
 * ofrecen franjas de 15 minutos durante las próximas 3 horas.
 */
const SLOT_COUNT = 12;
const LEAD_MINUTES = 15;

/** 9:15 a. m. */
function formatTime(d: Date): string {
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h % 12 || 12}:${m} ${h < 12 ? 'a. m.' : 'p. m.'}`;
}

function buildSlots(now: Date): string[] {
  const start = new Date(now.getTime() + LEAD_MINUTES * 60_000);
  const rounded = Math.ceil(start.getMinutes() / SLOT_MINUTES) * SLOT_MINUTES;
  start.setMinutes(rounded, 0, 0);
  return Array.from({ length: SLOT_COUNT }, (_, i) => formatTime(new Date(start.getTime() + i * SLOT_MINUTES * 60_000)));
}

/** Hoja inferior para elegir la hora de recogida. */
const TimePickerModal = ({ isOpen, onClose, onConfirm }: TimePickerModalProps) => {
  const slots = useMemo(() => (isOpen ? buildSlots(new Date()) : []), [isOpen]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setSelected(null);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected);
    onClose();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end justify-center">
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
            aria-labelledby="time-picker-title"
            initial={{ transform: 'translateY(100%)' }}
            animate={{ transform: 'translateY(0%)' }}
            exit={{ transform: 'translateY(100%)' }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10 w-full max-w-[400px] rounded-t-[16px] bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-4 shadow-lift"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 id="time-picker-title" className="font-display text-[26px] font-extrabold leading-tight text-ink">
                  ¿A qué hora lo recoges?
                </h2>
                <p className="mt-1 text-[15px] text-muted">Hoy. Tenemos tu pedido listo a esa hora.</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="-mr-2 -mt-1 grid h-11 w-11 shrink-0 place-items-center text-ink"
              >
                <X size={24} aria-hidden />
              </button>
            </div>

            <div role="radiogroup" aria-label="Hora de recogida" className="mt-4 grid grid-cols-3 gap-2">
              {slots.map((slot) => {
                const active = selected === slot;
                return (
                  <button
                    key={slot}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSelected(slot)}
                    className={`num h-12 rounded-md border-[1.5px] text-[16px] transition-colors duration-150 ${
                      active ? 'border-ink bg-ink text-white' : 'border-line text-ink'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selected}
              className="mt-5 h-[54px] w-full rounded-md bg-ink text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:opacity-45"
            >
              {selected ? `Recoger a las ${selected}` : 'Elige una hora'}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default TimePickerModal;
