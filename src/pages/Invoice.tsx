import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Coffee,
  Download,
  MapPin,
  RotateCcw,
  Share2,
  Store,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCOP } from '../lib/format';

// Datos mock de fallback si no se recibe el pedido por state
const MOCK_INVOICE = {
  id: 1238,
  status: 'completada' as const,
  date: '10 Sep 2026, 2:15 PM',
  store: 'Café Quindío · Centro',
  address: 'Calle 12 #9-34, Armenia, Quindío',
  paymentMethod: 'Tarjeta Visa ••••4521 (Wompi)',
  deliveryType: 'Recoger en tienda',
  items: [
    { name: 'Nitro Cold Brew', size: 'Grande', quantity: 1, unitPrice: 31000 },
    { name: 'Caramel Latte', size: 'Regular', quantity: 1, unitPrice: 28000 },
    { name: 'Espresso extra', size: '', quantity: 1, unitPrice: 5000 },
  ],
  discount: 2500,
};

const stagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" as any } },
};

const Invoice = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Acepta datos desde navigate state o usa el mock de fallback
  const invoiceData = (location.state as { order?: typeof MOCK_INVOICE })?.order ?? MOCK_INVOICE;
  const items = (invoiceData as any).items ?? MOCK_INVOICE.items;
  const subtotal = items.reduce((s: number, i: any) => s + i.unitPrice * i.quantity, 0);
  const discount = (invoiceData as any).discount ?? MOCK_INVOICE.discount;
  const total = subtotal - discount;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Recibo Pedido #${(invoiceData as any).id ?? MOCK_INVOICE.id}`,
        text: `Mi pedido en Café Quindío por ${formatCOP(total)}`,
      });
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream">
      {/* Header */}
      <div className="sticky top-0 z-[20] flex items-center gap-1 border-b border-line bg-cream/90 px-2 py-3 backdrop-blur-xl">
        <button
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream-deep"
        >
          <ArrowLeft size={24} aria-hidden />
        </button>
        <h1 className="flex-1 font-display text-[18px] font-semibold text-ink">
          Recibo del pedido
        </h1>
        <button
          onClick={handleShare}
          aria-label="Compartir recibo"
          className="flex h-10 w-10 items-center justify-center rounded-full text-brand transition-colors hover:bg-brand-soft"
        >
          <Share2 size={20} aria-hidden />
        </button>
      </div>

      <motion.div variants={stagger} initial="initial" animate="animate" className="flex flex-col gap-4 px-5 pb-32 pt-4">
        {/* ── Encabezado del recibo ── */}
        <motion.div
          variants={fadeUp}
          className="relative overflow-hidden rounded-2xl text-cream"
          style={{ background: 'linear-gradient(160deg, #0F1F1E 0%, #1A2E2C 50%, #243B38 100%)' }}
        >
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(73,180,170,0.20) 0%, transparent 60%)' }} />
          <div className="relative p-5">
            <div className="mb-4 flex items-center justify-between">
              <img
                src="/Artes corporativos/Logo-Slogan/Logo-Blanco.png"
                alt="Café Quindío"
                className="w-32 object-contain"
              />
              <Badge tone="success">
                <CheckCircle2 size={11} aria-hidden />
                Pagado
              </Badge>
            </div>
            <p className="font-display text-[28px] font-semibold">{formatCOP(total)}</p>
            <p className="mt-1 text-[13px] text-muted-soft">Pedido #{(invoiceData as any).id ?? MOCK_INVOICE.id}</p>
            <p className="text-[13px] text-muted-soft">{(invoiceData as any).date ?? MOCK_INVOICE.date}</p>
          </div>
        </motion.div>

        {/* ── Tienda ── */}
        <motion.div variants={fadeUp} className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-muted">Lugar de recogida</h2>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
              <Store size={18} className="text-brand" aria-hidden />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-ink">{(invoiceData as any).store ?? MOCK_INVOICE.store}</p>
              <p className="flex items-center gap-1 text-[12px] text-muted">
                <MapPin size={11} className="text-brand" aria-hidden />
                {MOCK_INVOICE.address}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Ítems del pedido ── */}
        <motion.div variants={fadeUp} className="rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-3 text-[13px] font-bold uppercase tracking-widest text-muted">Detalle</h2>
          <div className="flex flex-col gap-2">
            {items.map((item: any, i: number) => (
              <div key={i} className="flex items-start justify-between">
                <div>
                  <p className="text-[14px] font-medium text-ink">
                    {item.quantity > 1 && <span className="mr-1 font-bold text-brand">{item.quantity}×</span>}
                    {item.name}
                  </p>
                  {item.size && <p className="text-[12px] text-muted">{item.size}</p>}
                </div>
                <span className="text-[14px] font-semibold text-ink">{formatCOP(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="my-3 h-px border-t border-dashed border-line" />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[13px] text-muted">
              <span>Subtotal</span>
              <span>{formatCOP(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[13px] text-success">
                <span>Descuento aplicado</span>
                <span>-{formatCOP(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[15px] font-bold text-ink">
              <span>Total</span>
              <span>{formatCOP(total)}</span>
            </div>
          </div>
        </motion.div>

        {/* ── Método de pago ── */}
        <motion.div variants={fadeUp} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
            <Coffee size={18} className="text-brand" aria-hidden />
          </div>
          <div className="flex-1">
            <p className="text-[12px] text-muted">Método de pago</p>
            <p className="text-[14px] font-semibold text-ink">{MOCK_INVOICE.paymentMethod}</p>
          </div>
        </motion.div>

        {/* ── Acciones ── */}
        <motion.div variants={fadeUp} className="flex flex-col gap-2">
          <Button onClick={() => navigate('/menu')} className="w-full">
            <RotateCcw size={16} aria-hidden />
            Pedir de nuevo
          </Button>
          <button
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-3 text-[14px] font-semibold text-muted-strong"
          >
            <Download size={16} aria-hidden />
            Descargar PDF
          </button>
        </motion.div>

        <div className="text-center">
        </div>
      </motion.div>
    </div>
  );
};

export default Invoice;
