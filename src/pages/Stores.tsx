import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Phone } from 'lucide-react';
import { storeService } from '../lib/storeService';
import { useCart } from '../lib/cart';
import type { Store } from '../lib/types';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';

const Stores = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();

  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      setStores(await storeService.getStores());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const select = (store: Store) => {
    dispatch({ type: 'SET_STORE', storeId: store.id_tienda });
    navigate(-1);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream">
      <div className="sticky top-0 z-40 flex items-center gap-1 border-b border-line bg-cream/90 px-2 py-3 backdrop-blur-xl">
        <button onClick={() => navigate(-1)} aria-label="Volver" className="flex h-10 w-10 items-center justify-center text-ink">
          <ArrowLeft size={24} aria-hidden />
        </button>
        <img
          src="/Artes corporativos/Logo-Slogan/Logos-Slogan-Café.png"
          alt="Café Quindío"
          className="w-28 object-contain"
        />
      </div>

      <div className="flex flex-col gap-3 px-5 py-5">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-3xl bg-surface p-4 shadow-soft">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          ))
        ) : error ? (
          <ErrorState onRetry={load} />
        ) : stores.length === 0 ? (
          <EmptyState icon={MapPin} title="Sin tiendas" description="No hay tiendas disponibles por ahora." />
        ) : (
          stores.map((store) => {
            const open = store.estado.toUpperCase() === 'ABIERTO';
            const selected = state.storeId === store.id_tienda;
            return (
              <button
                key={store.id_tienda}
                onClick={() => select(store)}
                aria-pressed={selected}
                className={`flex flex-col gap-2 rounded-3xl border p-4 text-left transition-colors ${
                  selected ? 'border-brand bg-brand-soft' : 'border-line bg-surface hover:bg-cream-deep'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold text-ink">{store.nombre}</h2>
                  <Badge tone={open ? 'success' : 'danger'}>
                    <Clock size={12} aria-hidden />
                    {open ? 'Abierto' : 'Cerrado'}
                  </Badge>
                </div>
                <span className="flex items-center gap-1.5 text-[13px] text-muted">
                  <MapPin size={14} className="shrink-0 text-brand" aria-hidden />
                  {store.direccion}
                </span>
                {store.telefono && (
                  <span className="flex items-center gap-1.5 text-[13px] text-muted">
                    <Phone size={14} className="shrink-0 text-brand" aria-hidden />
                    {store.telefono}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Stores;
