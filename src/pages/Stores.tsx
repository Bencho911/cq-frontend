import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, MapPin, Phone } from 'lucide-react';
import { storeService } from '../lib/storeService';
import { useCart } from '../lib/cart';
import { storeShortName } from '../lib/session';
import type { Store } from '../lib/types';
import { PageHeader } from '../components/brand/PageHeader';
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

  // Igual que useSelectedStore: sin elección explícita, se recoge en la primera abierta.
  const currentId =
    state.storeId ?? (stores.find((s) => s.estado.toUpperCase() === 'ABIERTO') ?? stores[0])?.id_tienda ?? null;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream pb-8">
      <PageHeader title="Elige tu tienda" onBack={() => navigate(-1)} />
      <p className="px-5 text-[15px] text-muted">Aquí preparamos tu pedido y lo recoges.</p>

      <div className="px-5 pt-4">
        {loading ? (
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2 rounded-md border-[1.5px] border-line p-4">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState onRetry={load} />
        ) : stores.length === 0 ? (
          <EmptyState icon={MapPin} title="Sin tiendas" description="No hay tiendas disponibles por ahora." />
        ) : (
          <ul className="flex flex-col gap-2.5" role="radiogroup" aria-label="Tiendas">
            {stores.map((store) => {
              const open = store.estado.toUpperCase() === 'ABIERTO';
              const selected = currentId === store.id_tienda;
              return (
                <li key={store.id_tienda}>
                  <button
                    onClick={() => select(store)}
                    role="radio"
                    aria-checked={selected}
                    className={`grid w-full grid-cols-[1fr_24px] gap-3 rounded-md border-[1.5px] p-4 text-left transition-[transform,border-color] duration-150 active:scale-[0.97] ${
                      selected ? 'border-ink' : 'border-line'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-[22px] font-extrabold leading-tight text-ink">
                          {storeShortName(store)}
                        </span>
                        <Badge tone={open ? 'brand' : 'danger'}>{open ? 'Abierta' : 'Cerrada'}</Badge>
                      </span>
                      <span className="mt-1.5 flex items-start gap-2 text-[15px] leading-snug text-muted">
                        <MapPin size={16} strokeWidth={1.8} className="mt-0.5 shrink-0 text-muted" aria-hidden />
                        {store.direccion}
                      </span>
                      {store.telefono && (
                        <span className="num mt-1 flex items-center gap-2 text-[15px] text-muted">
                          <Phone size={16} strokeWidth={1.8} className="shrink-0 text-muted" aria-hidden />
                          {store.telefono}
                        </span>
                      )}
                    </span>
                    <span
                      className={`mt-1 grid h-6 w-6 place-items-center rounded-full ${
                        selected ? 'bg-ink text-white' : 'border-[1.5px] border-line'
                      }`}
                      aria-hidden
                    >
                      {selected && <Check size={15} strokeWidth={3} />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Stores;
