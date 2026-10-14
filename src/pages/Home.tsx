import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Coffee, MapPin, ShoppingBag } from 'lucide-react';
import { productService } from '../lib/productService';
import type { Category, Product } from '../lib/types';
import { useCart, useCartTotals } from '../lib/cart';
import { discountedPrice, formatCOP } from '../lib/format';
import { resolveImageUrl } from '../lib/image';
import { MOCK_ACCOUNT, summarize } from '../lib/loyalty';
import {
  MOCK_LAST_ORDER_PRODUCT_IDS,
  MOCK_READY_MINUTES,
  MOCK_USER,
  greetingFor,
  storeShortName,
  useSelectedStore,
} from '../lib/session';
import { ProductCard } from '../components/ui/ProductCard';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import ProductDetailSheet from '../components/ui/ProductDetailSheet';
import { Door, type DoorTone } from '../components/brand/Door';
import { Stamp } from '../components/brand/Stamp';

/** Cada categoría es una puerta pintada; el orden de tonos se repite. */
const DOOR_STYLES: { tone: DoorTone; image: string }[] = [
  { tone: 'teal', image: '/brand/cafe-rama.webp' },
  { tone: 'rosa', image: '/brand/heliconia.webp' },
  { tone: 'verde', image: '/brand/palma.webp' },
];

/** Descripción corta por categoría cuando el backend no envía `desc_cat`. */
const DOOR_SUBTITLES: Record<string, string> = {
  café: 'Tintos, lattes y fríos',
  'sin café': 'Chocolates y aromáticas',
  pastelería: 'Para acompañar',
};

const Home = () => {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { count, subtotal } = useCartTotals();
  const store = useSelectedStore();
  const loyalty = summarize(MOCK_ACCOUNT);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [prods, cats] = await Promise.all([productService.getProducts(), productService.getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // `now` se refresca cada minuto para que el saludo cambie si la sesión
  // queda abierta cruzando de mañana a tarde o noche.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const lastOrder = useMemo(
    () => MOCK_LAST_ORDER_PRODUCT_IDS.map((id) => products.find((p) => p.cod_prod === id)).filter((p): p is Product => Boolean(p)),
    [products],
  );
  const lastOrderTotal = lastOrder.reduce((sum, p) => sum + discountedPrice(p.precio_unitario, p.descuento), 0);

  const reorder = () => {
    lastOrder.forEach((product) => dispatch({ type: 'ADD', item: { product, quantity: 1 } }));
    navigate('/checkout');
  };

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-cream pb-28">
      {/* ── Barra superior: marca, tienda y cuenta ── */}
      <header className="flex items-center justify-between gap-2 px-5 pt-[max(env(safe-area-inset-top),16px)]">
        <img src="/brand/logo-teal.webp" alt="Café Quindío" className="h-6 w-auto brightness-[0.55] saturate-[1.3]" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/stores')}
            className="flex h-11 items-center gap-1.5 rounded-full bg-cream-deep pl-3 pr-3 text-[15px] font-semibold text-ink"
            aria-label={store ? `Recoges en ${storeShortName(store)}. Cambiar tienda` : 'Elegir tienda'}
          >
            <MapPin size={17} aria-hidden />
            {store ? storeShortName(store) : 'Tienda'}
            <ChevronDown size={15} strokeWidth={2.4} aria-hidden />
          </button>
          <button
            onClick={() => navigate('/profile')}
            aria-label="Mi cuenta"
            className="grid h-11 w-11 place-items-center rounded-full bg-mostaza text-[16px] font-bold text-ink"
          >
            {MOCK_USER.initial}
          </button>
        </div>
      </header>

      <h1 className="px-5 pt-5 font-display text-[34px] font-extrabold leading-[0.98] text-ink">
        {greetingFor(now)},
        <span className="block text-muted">{MOCK_USER.firstName}.</span>
      </h1>

      {/* ── Lo de siempre: la puerta mostaza ── */}
      {lastOrder.length > 0 && (
        <>
          <section className="mt-5 grid grid-cols-[1fr_120px] gap-2.5 bg-mostaza px-5 pb-5 pt-[18px]">
            <div>
              <h2 className="font-display text-[25px] font-extrabold leading-none text-ink">¿Lo de siempre?</h2>
              <p className="mt-1.5 text-[15px] leading-snug text-ink">
                {lastOrder.map((p) => p.nom_prod).join(' y ')}, listos en {MOCK_READY_MINUTES} minutos.
              </p>
              <button
                onClick={reorder}
                className="mt-3.5 inline-flex h-12 items-center gap-2 rounded-md bg-ink px-4 text-[16px] font-semibold text-white transition-transform duration-150 active:scale-[0.97]"
              >
                Pedir por <span className="num">{formatCOP(lastOrderTotal)}</span>
              </button>
            </div>
            <div className="-mb-5 flex h-[124px] items-end justify-center self-end rounded-t-[56px] bg-white pb-1.5" aria-hidden>
              {lastOrder.slice(0, 2).map((p, i) => (
                <img
                  key={p.cod_prod}
                  src={resolveImageUrl(p.url_imagen ?? '')}
                  alt=""
                  className={`w-[60px] object-contain ${i > 0 ? '-ml-5' : ''}`}
                />
              ))}
            </div>
          </section>
          <div className="zocalo" aria-hidden />
        </>
      )}

      {/* ── Categorías: puertas ── */}
      {categories.length > 0 && (
        <nav aria-label="Categorías" className="grid grid-cols-3 gap-2 px-5 pt-5">
          {categories.slice(0, 3).map((cat, i) => {
            const style = DOOR_STYLES[i % DOOR_STYLES.length];
            return (
              <Door
                key={cat.cod_cat}
                title={cat.nom_cat}
                subtitle={cat.desc_cat ?? DOOR_SUBTITLES[cat.nom_cat.toLowerCase()]}
                tone={style.tone}
                image={style.image}
                onClick={() => navigate('/menu', { state: { category: cat.nom_cat } })}
              />
            );
          })}
        </nav>
      )}

      {/* ── Lealtad: puntos y próxima ave ── */}
      {loyalty.nextBird && (
        <button
          onClick={() => navigate('/album')}
          className="mx-5 mt-5 grid grid-cols-[60px_1fr_auto_auto] items-center gap-3 rounded-md border-[1.5px] border-ink py-2.5 pl-2.5 pr-2 text-left"
        >
          <Stamp bird={loyalty.nextBird} state="next" className="h-[72px] w-[60px]" />
          <span>
            <span className="block text-[16px] font-bold text-ink">
              Te faltan <span className="num">{loyalty.pointsToReward}</span> puntos
            </span>
            <span className="block text-[14px] leading-snug text-muted">
              Para el {loyalty.nextBird.name} y tu bebida gratis
            </span>
          </span>
          <span className="text-right">
            <span className="block font-display text-[24px] font-extrabold leading-none text-ink">{loyalty.points}</span>
            <span className="text-[13px] text-muted">pts</span>
          </span>
          <ChevronRight size={18} className="text-muted" aria-hidden />
        </button>
      )}

      {/* ── Productos ── */}
      <section className="px-5 pt-6">
        <h2 className="font-display text-[22px] font-extrabold text-ink">Para esta {now.getHours() < 12 ? 'mañana' : now.getHours() < 18 ? 'tarde' : 'noche'}</h2>
        <div className="mt-1">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-line py-3">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))
          ) : error ? (
            <ErrorState onRetry={load} />
          ) : products.length === 0 ? (
            <EmptyState icon={Coffee} title="El menú está vacío" description="Vuelve en un momento: estamos actualizando los productos." />
          ) : (
            products.slice(0, 4).map((product) => (
              <ProductCard
                key={product.cod_prod}
                product={product}
                onClick={setSelectedProduct}
                onAdd={setSelectedProduct}
              />
            ))
          )}
        </div>
        {products.length > 4 && (
          <button onClick={() => navigate('/menu')} className="mt-2 flex h-12 items-center gap-1 text-[16px] font-semibold text-ink underline underline-offset-4">
            Ver todo el menú
          </button>
        )}
      </section>

      <ProductDetailSheet
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(item) => dispatch({ type: 'ADD', item })}
      />

      {/* ── Carrito flotante ── */}
      <AnimatePresence>
        {count > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            onClick={() => navigate('/checkout')}
            className="fixed bottom-[80px] left-0 right-0 z-50 mx-auto flex h-14 w-[calc(100%-40px)] max-w-[360px] items-center justify-between rounded-md bg-mostaza px-4 text-ink shadow-lift"
          >
            <span className="flex items-center gap-2.5 text-[16px] font-bold">
              <ShoppingBag size={20} aria-hidden />
              Ver pedido (<span className="num">{count}</span>)
            </span>
            <span className="num text-[16px] font-semibold">{formatCOP(subtotal)}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
