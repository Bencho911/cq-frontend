import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Download, RotateCcw, Share2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/brand/PageHeader';
import { formatCOP } from '../lib/format';
import { orderService } from '../lib/orderService';
import { useSelectedStore } from '../lib/session';
import { useReorder } from '../lib/reorder';

interface InvoiceItem {
  codProd?: number;
  name: string;
  size?: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceData {
  id: number;
  status?: string;
  date: string;
  store: string;
  address?: string;
  paymentMethod: string;
  deliveryType?: string;
  items: InvoiceItem[];
  discount?: number;
}

// MOCK: recibo de ejemplo si no llega el pedido por state ni se encuentra por id.
const MOCK_INVOICE: InvoiceData = {
  id: 1238,
  status: 'completada',
  date: '10 sep 2026, 2:15 p. m.',
  store: 'Café Quindío · Centro',
  address: 'Calle 12 #9-34, Armenia, Quindío',
  paymentMethod: 'Tarjeta Visa terminada en 4521 (Wompi)',
  deliveryType: 'Recoger en tienda',
  items: [
    { codProd: 3, name: 'Nitro Cold Brew', size: 'Grande', quantity: 1, unitPrice: 31000 },
    { codProd: 5, name: 'Caramel Latte', size: 'Regular', quantity: 1, unitPrice: 28000 },
    { name: 'Espresso extra', quantity: 1, unitPrice: 5000 },
  ],
  discount: 2500,
};

const PAYMENT_LABELS: Record<string, string> = {
  wompi: 'Tarjeta (Wompi)',
  efectivo: 'Efectivo en tienda',
  kiosco: 'Pago en kiosco',
};

const shortStore = (name: string) => `Tienda ${name.replace(/^Café Quindío\s*[·-]\s*/i, '')}`;

const Invoice = () => {
  const navigate = useNavigate();
  const { reorder, busy } = useReorder();
  const location = useLocation();
  const { id } = useParams();
  const selectedStore = useSelectedStore();

  // Acepta datos desde navigate state; si no, busca la orden por id; si no, usa el mock.
  const stateOrder = (location.state as { order?: InvoiceData } | null)?.order ?? null;
  const [fetched, setFetched] = useState<InvoiceData | null>(null);

  useEffect(() => {
    const numericId = Number(id);
    if (stateOrder || !Number.isFinite(numericId) || numericId <= 0) return;
    let alive = true;
    orderService
      .getOrderById(numericId)
      .then((o) => {
        if (!alive || !o.items || o.items.length === 0) return;
        const fecha = o.fecha_vent ? new Date(o.fecha_vent) : null;
        setFetched({
          id: o.id_vent,
          status: o.estado,
          date: fecha
            ? `${fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}, ${fecha.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })}`
            : '',
          store: selectedStore?.nombre ?? '',
          address: selectedStore?.direccion,
          paymentMethod: o.metodopago_usu ? PAYMENT_LABELS[o.metodopago_usu] ?? o.metodopago_usu : 'Pago en kiosco',
          deliveryType: o.tipo_entrega === 'domicilio' ? 'Domicilio' : 'Recoger en tienda',
          items: o.items.map((l) => ({ codProd: l.cod_prod, name: l.nom_prod ?? `Producto ${l.cod_prod}`, quantity: l.cantidad, unitPrice: l.precio_unit })),
          discount: 0,
        });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [id, stateOrder, selectedStore]);

  const invoice = stateOrder ?? fetched ?? MOCK_INVOICE;
  const items = invoice.items;
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const discount = invoice.discount ?? 0;
  const total = subtotal - discount;
  const storeName = invoice.store || (selectedStore ? selectedStore.nombre : '');
  const address = invoice.address ?? (selectedStore && storeName === selectedStore.nombre ? selectedStore.direccion : undefined);
  const cancelled = invoice.status === 'cancelada';

  const handleShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: `Recibo del pedido ${invoice.id}`,
        text: `Mi pedido en Café Quindío por ${formatCOP(total)}`,
      });
    } catch {
      /* el usuario cerró el diálogo de compartir */
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream">
      <PageHeader
        title="Recibo"
        onBack={() => navigate(-1)}
        action={
          <button onClick={handleShare} aria-label="Compartir recibo" className="grid h-11 w-11 shrink-0 place-items-center text-ink">
            <Share2 size={21} aria-hidden />
          </button>
        }
      />

      <div className="zocalo" aria-hidden />

      <div className="flex flex-col px-5 pb-12 pt-5">
        {/* Encabezado del comprobante */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[15px] text-muted">
              Pedido <span className="num text-ink">{invoice.id}</span>
            </p>
            {invoice.date && <p className="text-[15px] text-muted">{invoice.date}</p>}
          </div>
          <Badge tone={cancelled ? 'danger' : 'brand'}>{cancelled ? 'Cancelado' : 'Pagado'}</Badge>
        </div>
        <p className="num mt-3 font-display text-[44px] font-extrabold leading-none text-ink">{formatCOP(total)}</p>

        {/* Lugar y pago */}
        <dl className="mt-5 border-t border-line">
          {storeName && (
            <Field label={invoice.deliveryType === 'Domicilio' ? 'Preparado en' : 'Recogida'}>
              <span className="block text-ink">{shortStore(storeName)}</span>
              {address && <span className="block text-[14px] text-muted">{address}</span>}
            </Field>
          )}
          <Field label="Pago">
            <span className="text-ink">{invoice.paymentMethod}</span>
          </Field>
        </dl>

        {/* Detalle */}
        <h2 className="mt-6 font-display text-[20px] font-extrabold text-ink">Detalle</h2>
        <ul className="mt-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-start justify-between gap-4 border-b border-line py-3">
              <span className="min-w-0">
                <span className="block text-[16px] text-ink">
                  <span className="num mr-1.5 text-muted">{item.quantity}×</span>
                  {item.name}
                </span>
                {item.size && <span className="block text-[14px] text-muted">{item.size}</span>}
              </span>
              <span className="num shrink-0 text-[16px] text-ink">{formatCOP(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <dl className="pt-3">
          <div className="flex justify-between py-1 text-[15px]">
            <dt className="text-muted">Subtotal</dt>
            <dd className="num text-ink">{formatCOP(subtotal)}</dd>
          </div>
          {discount > 0 && (
            <div className="flex justify-between py-1 text-[15px]">
              <dt className="text-muted">Descuento</dt>
              <dd className="num text-success">−{formatCOP(discount)}</dd>
            </div>
          )}
          <div className="mt-2 flex items-baseline justify-between border-t-2 border-ink pt-3">
            <dt className="text-[17px] font-bold text-ink">Total</dt>
            <dd className="num text-[22px] font-semibold text-ink">{formatCOP(total)}</dd>
          </div>
        </dl>

        {/* Acciones */}
        <div className="mt-8 grid gap-2">
          <button
            onClick={() => reorder(items.map((i) => ({ codProd: i.codProd, name: i.name, quantity: i.quantity, size: i.size })))}
            disabled={busy}
            aria-busy={busy || undefined}
            className="flex h-[54px] items-center justify-center gap-2 rounded-md bg-ink text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:opacity-60"
          >
            <RotateCcw size={18} aria-hidden />
            Repetir pedido
          </button>
          <button
            onClick={() => window.print()}
            className="flex h-[52px] items-center justify-center gap-2 rounded-md border-[1.5px] border-ink text-[16px] font-semibold text-ink transition-transform duration-150 active:scale-[0.97]"
          >
            <Download size={18} aria-hidden />
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line py-3 text-[15px]">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="min-w-0 text-right">{children}</dd>
    </div>
  );
}

export default Invoice;
