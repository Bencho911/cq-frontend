import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();
  const { dispatch } = useCart();
  const { count, subtotal } = useCartTotals();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // Las puertas de Inicio abren el menú ya filtrado por su categoría.
  const [activeCategory, setActiveCategory] = useState<string>(
    (location.state as { category?: string } | null)?.category ?? ALL,
  );
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
          <h1 className="font-display text-[28px] font-extrabold text-ink">Menú</h1>
          <button
            onClick={() => navigate('/checkout')}
            aria-label="Ver carrito"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-cream-deep text-ink"
          >
            <ShoppingBag size={20} aria-hidden />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-mostaza px-1 text-[12px] font-bold text-ink">
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
            className="h-11 w-full rounded-md border border-line bg-cream-deep pl-4 pr-11 text-[16px] text-ink outline-none placeholder:text-muted-soft focus:border-brand"
          />
          <Search size={18} className="pointer-events-none absolute inset-y-0 right-4 my-auto text-muted-soft" aria-hidden />
        </div>

        <CategoryTabs categories={categoryNames} activeCategory={activeCategory} onSelect={setActiveCategory} />
      </div>

      <div className="flex flex-col px-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 border-b border-line py-3">
              <Skeleton className="h-16 w-16 rounded-full" />
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
          displayedProducts.map((product) => (
            // "+" abre el detalle: tamaño y leche se eligen antes de agregar.
            <ProductCard
              key={product.cod_prod}
              product={product}
              onClick={setSelectedProduct}
              onAdd={setSelectedProduct}
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

export default Menu;
