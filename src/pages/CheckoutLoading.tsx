import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WaitScreen } from '../components/brand/WaitScreen';

const CheckoutLoading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/order-success'), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <WaitScreen
      tone="verde"
      image="/brand/ventana-ave.webp"
      title="Enviando tu pedido."
      description="La tienda lo recibe en un momento."
    />
  );
};

export default CheckoutLoading;
