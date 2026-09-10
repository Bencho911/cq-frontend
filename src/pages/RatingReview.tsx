import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const RatingReview = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const submit = () => {
    // MOCK: el backend no expone endpoint de reseñas.
    toast.success('¡Gracias por tu reseña!');
    navigate('/home');
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream">
      <div className="sticky top-0 z-40 flex items-center gap-1 border-b border-line bg-cream/90 px-2 py-3 backdrop-blur-xl">
        <button onClick={() => navigate(-1)} aria-label="Cerrar" className="flex h-10 w-10 items-center justify-center text-ink">
          <X size={24} aria-hidden />
        </button>
        <img
          src="/Artes corporativos/Logo-Slogan/Logos-Slogan-Café.png"
          alt="Café Quindío"
          className="w-28 object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col pb-32">
        <div className="mt-2 flex justify-center">
          <div
            className="flex h-[150px] w-[150px] items-center justify-center overflow-hidden rounded-full"
            style={{ border: '3px solid var(--color-brand)', background: 'var(--color-brand-soft)', boxShadow: '0 0 32px rgba(73,180,170,0.20)' }}
          >
            <img src="/Artes corporativos/Composiciones/composiciones- 2.png" alt="Calificación" className="h-full w-full object-contain" />
          </div>
        </div>

        <h2 className="mt-6 px-5 text-center font-display text-[22px] font-semibold text-ink">
          ¿Qué tal estuvo tu pedido?
        </h2>

        <div className="mt-6 flex flex-col gap-4 px-5">
          <h3 className="text-[14px] font-medium text-ink">Puntuación</h3>
          <div className="mt-2 flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} aria-label={`${star} estrellas`} className="p-1">
                <Star
                  size={40}
                  strokeWidth={1.5}
                  className={`transition-colors ${star <= rating ? 'fill-star text-star' : 'fill-transparent text-muted-soft'}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="my-6 h-px bg-line" />

        <div className="flex flex-col px-5">
          <h3 className="mb-3 text-[14px] font-medium text-ink">Reseña</h3>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Cuéntanos sobre tu experiencia con el pedido."
            className="h-[120px] w-full resize-none rounded-2xl border border-line bg-surface p-4 text-[14px] text-ink outline-none placeholder:text-muted-soft focus:border-brand"
          />
          <p className="mt-2 text-[12px] text-muted">Las reseñas serán visibles para el público.</p>
          <div className="mt-3">
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-5 right-5 z-50 mx-auto max-w-[360px]">
        <Button onClick={submit} disabled={rating === 0} className="w-full">
          Enviar reseña
        </Button>
      </div>
    </div>
  );
};

export default RatingReview;
