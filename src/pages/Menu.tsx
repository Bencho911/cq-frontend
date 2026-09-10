import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';
import { productService } from '../lib/productService';
import type { Category, Product } from '../lib/types';
import { useCart, useCartTotals } from '../lib/cart';
import { formatCOP } from '../lib/format';
import { ProductCard } from '../components/ui/ProductCard';
import { CategoryTabs } from '../components/ui/CategoryTabs';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import ProductDetailSheet from '../components/ui/ProductDetailSheet';

const ALL = 'Todos';

const Menu = () => {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { count, subtotal } = useCartTotals();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [query, setQuery] = useState('');
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

  useEffect(() => {
    load();
  }, []);

  const categoryNames = useMemo(() => [ALL, ...categories.map((c) => c.nom_cat)], [categories]);

  const displayedProducts = useMemo(() => {
    let list = products;
    if (activeCategory !== ALL) {
      const cat = categories.find((c) => c.nom_cat === activeCategory);
      if (cat) list = list.filter((p) => p.fk_cod_cats?.includes(cat.cod_cat));
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) => p.nom_prod.toLowerCase().includes(q) || p.desc_prod.toLowerCase().includes(q),
      );
    }
    return list;
  }, [products, categories, activeCategory, query]);

  return (
    <div className="flex min-h-[100dvh] flex-col pb-28">
      <div className="sticky top-0 z-40 border-b border-line bg-cream/90 px-5 pb-3 pt-5 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          {/* Logo real en lugar de texto plano */}
          <img
            src="/Artes corporativos/Logo-Slogan/Logos-Slogan-Café.png"
            alt="Menú Café Quindío"
            className="w-32 object-contain"
          />
          <button
            onClick={() => navigate('/checkout')}
            aria-label="Ver carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-surface text-ink shadow-soft"
          >
            <ShoppingBag size={20} aria-hidden />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-cream">
                {count}
              </span>
            )}
          </button>
        </div>

        <div className="relative mb-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="¿Qué se te antoja hoy?"
            aria-label="Buscar en el menú"
            className="h-11 w-full rounded-2xl border border-line bg-surface pl-4 pr-11 text-[14px] text-ink outline-none placeholder:text-muted-soft focus:border-brand"
          />
          <Search size={18} className="pointer-events-none absolute inset-y-0 right-4 my-auto text-muted-soft" aria-hidden />
        </div>

        <CategoryTabs categories={categoryNames} activeCategory={activeCategory} onSelect={setActiveCategory} />
      </div>

      <div className="mt-3 flex flex-col gap-3 px-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-3xl bg-surface p-3">
              <Skeleton className="h-[88px] w-[88px] rounded-2xl" />
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
          <EmptyState icon={Search} title="Sin resultados" description="Prueba con otra categoría o búsqueda." />
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

      <AnimatePresence>
        {count > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            onClick={() => navigate('/checkout')}
            className="fixed bottom-[88px] left-0 right-0 z-50 mx-auto flex w-[calc(100%-40px)] max-w-[360px] items-center justify-between rounded-2xl bg-brand p-4 text-cream shadow-lift"
          >
            <span className="flex items-center gap-3">
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

export default Menu;
