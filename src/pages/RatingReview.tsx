import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../components/brand/PageHeader';

const LABELS = ['Muy malo', 'Malo', 'Normal', 'Casi perfecto', 'Perfecto'];

const RatingReview = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const submit = () => {
    // MOCK: el backend no expone endpoint de reseñas.
    toast.success('Gracias por calificar tu pedido');
    navigate('/home');
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream">
      <PageHeader title="Calificar" onBack={() => navigate(-1)} />

      <div className="flex flex-1 flex-col px-5 pb-36 pt-2">
        <h2 className="font-display text-[36px] font-extrabold leading-[0.98] tracking-[-0.04em] text-ink">
          ¿Cómo estuvo tu pedido?
        </h2>
        <p className="mt-2 text-[16px] text-muted">Tu opinión le llega a la barra de la tienda.</p>

        <div role="radiogroup" aria-label="Calificación" className="mt-7 flex justify-between">
          {LABELS.map((label, i) => {
            const value = i + 1;
            const on = value <= rating;
            return (
              <button
                key={label}
                role="radio"
                aria-checked={rating === value}
                aria-label={label}
                onClick={() => setRating(value)}
                className="grid h-14 w-14 place-items-center transition-transform duration-150 active:scale-[0.97]"
              >
                <Star
                  size={40}
                  strokeWidth={1.6}
                  className={`text-ink transition-colors ${on ? 'fill-mostaza' : 'fill-transparent'}`}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
        <p className="mt-2 h-6 text-center text-[17px] font-semibold text-ink" aria-live="polite">
          {rating > 0 ? LABELS[rating - 1] : <span className="font-normal text-muted">Toca una estrella</span>}
        </p>

        <div className="mt-7 flex flex-col gap-1.5">
          <label htmlFor="review" className="text-[14px] font-semibold text-ink">
            Cuéntanos más (opcional)
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Qué te gustó o qué podemos mejorar"
            aria-describedby="review-hint"
            className="h-[128px] w-full resize-none rounded-md border border-line bg-cream-deep px-4 py-3 text-[16px] text-ink transition-colors duration-200 placeholder:text-muted-soft focus:border-ink focus:outline-none"
          />
          <p id="review-hint" className="text-[13px] text-muted">Tu reseña será visible para otros clientes.</p>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[400px] border-t border-line bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3">
        <button
          onClick={submit}
          disabled={rating === 0}
          className="flex h-[54px] w-full items-center justify-center rounded-md bg-ink text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:opacity-45 disabled:active:scale-100"
        >
          Enviar calificación
        </button>
      </div>
    </div>
  );
};

export default RatingReview;
