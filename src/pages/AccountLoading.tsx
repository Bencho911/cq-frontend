import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WaitScreen } from '../components/brand/WaitScreen';

const AccountLoading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/create-pin'), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <WaitScreen
      tone="rosa"
      image="/brand/capibara-palmas.webp"
      title="Creando tu cuenta."
      description="Ya casi: falta elegir tu PIN."
    />
  );
};

export default AccountLoading;
