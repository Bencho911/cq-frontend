import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, type Transition } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, Coffee, MapPin, Search, ShoppingBag, Sparkles } from 'lucide-react';
import { productService } from '../lib/productService';
import type { Category, Product } from '../lib/types';
import { useCart, useCartTotals } from '../lib/cart';
import { formatCOP } from '../lib/format';
import { ProductCard } from '../components/ui/ProductCard';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import ProductDetailSheet from '../components/ui/ProductDetailSheet';

// Cada banner puede apuntar a una ruta distinta (p. ej. una categoría
// específica del menú). Ajusta `href` según tus rutas reales.
const BANNERS = [
  {
    src: '/Artes corporativos/Composiciones/composiciones- 1.png',
    label: 'Sabor del Quindío',
    sub: 'El café del corazón de Colombia',
    bg: '#D6F0ED',
    href: '/menu',
  },
  {
    src: '/Artes corporativos/Composiciones/composiciones- 2.png',
    label: '¡Nuevas bebidas!',
    sub: 'Descúbrelas esta temporada',
    bg: '#FAE0BC',
    href: '/menu',
  },
  {
    src: '/Artes corporativos/Composiciones/composiciones- 4.png',
    label: 'Tradición colombiana',
    sub: 'Pide ya y recoge en minutos',
    bg: '#E8D5F0',
    href: '/menu',
  },
];

const stagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.07 } },
};

// Transición tipada explícitamente en vez de castear `ease` con `as any`.
const EASE_OUT_TRANSITION: Transition = { duration: 0.4, ease: 'easeOut' };
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: EASE_OUT_TRANSITION },
};

const Home = () => {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { count, subtotal } = useCartTotals();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [activeBanner, setActiveBanner] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      const next = activeBanner >= BANNERS.length - 1 ? 0 : activeBanner + 1;
      setActiveBanner(next);
      carouselRef.current?.scrollTo({ left: next * (carouselRef.current?.clientWidth ?? 0), behavior: 'smooth' });
    }, 4000);
    return () => clearInterval(interval);
  }, [loading, activeBanner]);

  const featuredProducts = useMemo(
    () => products.filter((p) => p.descuento && p.descuento > 0).slice(0, 2),
    [products],
  );

  const displayedProducts = useMemo(() => {
    let list = products;
    if (activeCategory !== 'all') {
      list = list.filter((p) => p.fk_cod_cats?.includes(activeCategory));
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.nom_prod.toLowerCase().includes(q) || p.desc_prod.toLowerCase().includes(q));
    }
    return list;
  }, [products, activeCategory, query]);

  // `now` se refresca cada minuto para que el saludo cambie solo si la
  // sesión queda abierta cruzando de mañana a tarde/noche, sin depender
  // de que algo más dispare un re-render.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const greeting = useMemo(() => {
    const h = now.getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }, [now]);

  return (
    <div className="relative flex min-h-[100dvh] flex-col pb-28">
      {/* ── Header con logo real de Café Quindío ── */}
      <div className="sticky top-0 z-[20] border-b border-line bg-cream/90 px-5 pb-3 pt-safe-top pt-5 backdrop-blur-xl">
        <motion.div variants={stagger} initial="initial" animate="animate" className="mb-3 flex items-center justify-between">
          <motion.div variants={fadeUp}>
            {/* Logo real de la empresa */}
            <img
              src="/Artes corporativos/Logo-Slogan/Logos-Slogan-Café.png"
              alt="Café Quindío"
              className="w-36 object-contain"
            />
            <p className="mt-0.5 text-[12px] font-medium text-muted">{greeting} ☀️</p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex items-center gap-1">
            <button
              onClick={() => navigate('/stores')}
              aria-label="Elegir tienda"
              className="flex h-10 w-10 items-center justify-center rounded-full text-brand transition-colors hover:bg-brand-soft"
            >
              <MapPin size={20} aria-hidden />
            </button>
            <button
              onClick={() => navigate('/notifications')}
              aria-label="Notificaciones"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-brand transition-colors hover:bg-brand-soft"
            >
              <Bell size={20} aria-hidden />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-cream" />
            </button>
          </motion.div>
        </motion.div>

        {/* Buscador */}
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute inset-y-0 left-4 my-auto text-muted-soft"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar bebidas, pasteles y más…"
            aria-label="Buscar productos"
            className="h-11 w-full rounded-full border border-line bg-surface pl-11 pr-11 text-[14px] font-medium text-ink outline-none placeholder:text-muted-soft transition-colors focus:border-brand"
          />
          <Coffee size={17} className="pointer-events-none absolute inset-y-0 right-4 my-auto text-brand" aria-hidden />
        </div>
      </div>

      {/* ── Carrusel con artes corporativos reales ── */}
      <div className="mx-5 mt-5">
        <div
          ref={carouselRef}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-2xl"
          style={{ boxShadow: 'var(--shadow-lift)' }}
          onScroll={(e) => {
            const w = e.currentTarget.clientWidth;
            setActiveBanner(Math.round(e.currentTarget.scrollLeft / w));
          }}
        >
          {BANNERS.map((banner, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => navigate(banner.href)}
              className="relative h-[160px] w-full shrink-0 snap-center overflow-hidden text-left"
              style={{ backgroundColor: banner.bg }}
            >
              {/* Texto superpuesto + CTA */}
              <div className="absolute left-0 top-0 z-10 flex h-full w-[55%] flex-col justify-center gap-3 px-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand">{banner.sub}</p>
                  <h2 className="mt-1 font-display text-[19px] font-semibold leading-tight text-ink">{banner.label}</h2>
                </div>
                <span className="inline-flex w-fit items-center rounded-full bg-brand px-3.5 py-1.5 text-[12px] font-bold text-cream shadow-soft">
                  Pedir ahora
                </span>
              </div>
              {/* Imagen de composición corporativa */}
              <img
                src={banner.src}
                alt={banner.label}
                className="absolute right-0 top-0 h-full w-[55%] object-contain object-right"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </button>
          ))}
        </div>
        <div className="mt-2.5 flex justify-center gap-1.5">
          {BANNERS.map((_, idx) => (
            <motion.div
              key={idx}
              animate={{ width: activeBanner === idx ? 20 : 6, backgroundColor: activeBanner === idx ? 'var(--color-brand)' : 'var(--color-line)' }}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* ── En especial hoy ── */}
      {!loading && featuredProducts.length > 0 && (
        <div className="mt-6 px-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-accent" aria-hidden />
            <h2 className="text-[14px] font-bold uppercase tracking-widest text-accent-deep">Hoy en especial</h2>
          </div>
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
            {featuredProducts.map((p) => {
              // Asume que `precio_unitario` ya es el precio CON descuento
              // aplicado, y reconstruye el original para el tachado. Si tu
              // backend guarda el precio original por separado, úsalo
              // directamente en vez de este cálculo.
              const originalPrice = p.descuento
                ? Math.round(p.precio_unitario / (1 - p.descuento / 100))
                : null;

              return (
                <motion.button
                  key={p.cod_prod}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedProduct(p)}
                  className="shrink-0 overflow-hidden rounded-2xl bg-surface"
                  style={{ width: 160, boxShadow: 'var(--shadow-card)' }}
                >
                  <div className="relative h-[100px] w-full bg-cream-deep">
                    {p.url_imagen && (
                      <img src={p.url_imagen} alt={p.nom_prod} className="h-full w-full object-contain p-2" />
                    )}
                    {p.descuento && (
                      <div
                        className="absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cream"
                        style={{ background: 'var(--color-accent)' }}
                      >
                        -{p.descuento}%
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="truncate text-[13px] font-bold text-ink">{p.nom_prod}</p>
                    <div className="mt-0.5 flex items-baseline gap-1.5">
                      {originalPrice !== null && (
                        <span className="text-[11px] font-medium text-muted-soft line-through">
                          {formatCOP(originalPrice)}
                        </span>
                      )}
                      <p className="text-[13px] font-bold text-accent">{formatCOP(p.precio_unitario)}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Categorías ── */}
      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-5">
        <button
          onClick={() => setActiveCategory('all')}
          aria-pressed={activeCategory === 'all'}
          className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all ${activeCategory === 'all'
              ? 'bg-brand text-cream shadow-soft'
              : 'bg-cream-deep text-muted-strong hover:bg-line'
            }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.cod_cat}
            onClick={() => setActiveCategory(cat.cod_cat)}
            aria-pressed={activeCategory === cat.cod_cat}
            className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all ${activeCategory === cat.cod_cat
                ? 'bg-brand text-cream shadow-soft'
                : 'bg-cream-deep text-muted-strong hover:bg-line'
              }`}
          >
            {cat.nom_cat}
          </button>
        ))}
      </div>

      {/* ── Lista de productos ── */}
      <div className="mt-5 flex flex-col gap-3 px-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl bg-surface p-3">
              <Skeleton className="h-[88px] w-[88px] rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))
        ) : error ? (
          <ErrorState onRetry={load} />
        ) : displayedProducts.length === 0 ? (
          <EmptyState icon={Coffee} title="Sin resultados" description="No encontramos productos con esos filtros." />
        ) : (
          displayedProducts.map((product, index) => (
            <ProductCard
              key={product.cod_prod}
              product={product}
              index={index}
              onClick={setSelectedProduct}
              onAdd={(p) => dispatch({ type: 'ADD', item: { product: p, quantity: 1 } })}
            />
          ))
        )}
      </div>

      <ProductDetailSheet
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(item) => dispatch({ type: 'ADD', item })}
      />

      {/* ── Botón flotante del carrito ── */}
      <AnimatePresence>
        {count > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.9 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            onClick={() => navigate('/checkout')}
            className="fixed bottom-[88px] left-0 right-0 z-50 mx-auto flex w-[calc(100%-40px)] max-w-[360px] items-center justify-between rounded-2xl bg-brand px-4 py-3.5 text-cream"
            style={{ boxShadow: 'var(--shadow-accent)' }}
          >
            <span className="flex items-center gap-2.5">
              <ShoppingBag size={20} aria-hidden />
              <span className="text-[14px] font-bold">{count} {count === 1 ? 'ítem' : 'ítems'}</span>
            </span>
            <span className="text-[16px] font-bold">{formatCOP(subtotal)}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;