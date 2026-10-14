import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { formatPickup, upcomingPickup } from '../../lib/pickup';

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Fecha ISO de la franja elegida, o `null` para "lo antes posible". */
  onConfirm: (time: string | null) => void;
  /** Valor actual, para abrir la hoja con esa opción marcada. */
  value?: string | null;
  /** Minutos estimados de preparación para "lo antes posible". */
  readyMinutes?: number;
}

const ASAP = 'asap';

const SLOT_MINUTES = 15;
/**
 * MOCK: la tienda aún no informa su horario ni su capacidad, así que se
 * ofrecen franjas de 15 minutos durante las próximas 3 horas.
 */
const SLOT_COUNT = 12;
const LEAD_MINUTES = 15;

function buildSlots(now: Date): string[] {
  const start = new Date(now.getTime() + LEAD_MINUTES * 60_000);
  const rounded = Math.ceil(start.getMinutes() / SLOT_MINUTES) * SLOT_MINUTES;
  start.setMinutes(rounded, 0, 0);
  return Array.from({ length: SLOT_COUNT }, (_, i) => new Date(start.getTime() + i * SLOT_MINUTES * 60_000).toISOString());
}

/** Hoja inferior para elegir la hora de recogida. */
const TimePickerModal = ({ isOpen, onClose, onConfirm, value = null, readyMinutes }: TimePickerModalProps) => {
  const slots = useMemo(() => (isOpen ? buildSlots(new Date()) : []), [isOpen]);
  const [selected, setSelected] = useState<string>(ASAP);

  // Abre con la opción vigente marcada; si la hora guardada ya no está
  // entre las franjas (pasó o es de otro día), vuelve a "lo antes posible".
  useEffect(() => {
    if (!isOpen) return;
    const current = upcomingPickup(value);
    setSelected(current && slots.includes(current) ? current : ASAP);
  }, [isOpen, value, slots]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    onConfirm(selected === ASAP ? null : selected);
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
                <p className="mt-1 text-[15px] text-muted">Hoy. Lo preparamos para que esté listo cuando llegues.</p>
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
              <button
                role="radio"
                aria-checked={selected === ASAP}
                onClick={() => setSelected(ASAP)}
                className={`col-span-3 flex min-h-[56px] items-center justify-between rounded-md border-[1.5px] px-4 text-left transition-colors duration-150 ${
                  selected === ASAP ? 'border-ink bg-ink text-white' : 'border-line text-ink'
                }`}
              >
                <span className="text-[16px] font-semibold">Lo antes posible</span>
                {readyMinutes != null && (
                  <span className={`text-[14px] ${selected === ASAP ? 'text-[#D7ECE9]' : 'text-muted'}`}>
                    Listo en unos <span className="num">{readyMinutes}</span> min
                  </span>
                )}
              </button>
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
                    {formatPickup(slot)}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleConfirm}
              className="mt-5 h-[54px] w-full rounded-md bg-ink text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97]"
            >
              {selected === ASAP ? 'Recoger lo antes posible' : `Recoger a las ${formatPickup(selected)}`}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default TimePickerModal;
