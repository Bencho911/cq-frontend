import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WaitScreen } from '../components/brand/WaitScreen';

const OTPLoading = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const telefono = location.state?.telefono || '300 000 0000';

  useEffect(() => {
    const timer = setTimeout(() => navigate('/confirm-otp', { state: { telefono } }), 3000);
    return () => clearTimeout(timer);
  }, [navigate, telefono]);

  return (
    <WaitScreen
      tone="mostaza"
      image="/brand/ventana-amarilla.webp"
      title="Enviando tu código."
      description="Llega por SMS en unos segundos."
    />
  );
};

export default OTPLoading;
