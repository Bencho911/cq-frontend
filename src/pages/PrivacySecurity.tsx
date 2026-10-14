import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Fingerprint, Lock, ShieldAlert, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/brand/PageHeader';
import { ListRow } from '../components/brand/ListRow';

const PrivacySecurity = () => {
  const navigate = useNavigate();
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream pb-20">
      <PageHeader title="Privacidad y seguridad" onBack={() => navigate(-1)} />

      <section className="px-5 pt-4">
        <h2 className="font-display text-[20px] font-extrabold text-ink">Seguridad de la cuenta</h2>
        <ul className="mt-1">
          <li>
            <ListRow icon={Lock} label="Cambiar PIN" description="Actualiza tu código de acceso" onClick={() => {}} />
          </li>
          <li>
            <ListRow
              icon={Fingerprint}
              label="Entrar con biometría"
              description="Face ID o huella"
              value={
                <button
                  role="switch"
                  aria-checked={biometricsEnabled}
                  aria-label="Entrar con biometría"
                  onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                  className="grid h-11 w-[56px] place-items-center"
                >
                  <span
                    className={`relative block h-[30px] w-[50px] rounded-full transition-colors duration-200 ${
                      biometricsEnabled ? 'bg-ink' : 'bg-muted-soft'
                    }`}
                  >
                    <span
                      className={`absolute left-[3px] top-[3px] h-6 w-6 rounded-full bg-white shadow-xs transition-transform duration-200 ease-out ${
                        biometricsEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </span>
                </button>
              }
            />
          </li>
        </ul>
      </section>

      <section className="px-5 pt-7">
        <h2 className="font-display text-[20px] font-extrabold text-ink">Legal y políticas</h2>
        <ul className="mt-1">
          <li>
            <ListRow icon={FileText} label="Términos y condiciones" onClick={() => {}} />
          </li>
          <li>
            <ListRow icon={ShieldAlert} label="Política de privacidad" onClick={() => {}} />
          </li>
        </ul>
      </section>

      <section className="px-5 pt-7">
        <ListRow icon={Trash2} label="Eliminar mi cuenta" danger chevron={false} onClick={() => {}} className="border-b-0" />
        <p className="text-[14px] leading-relaxed text-muted">
          Se borran tus datos, tu historial de pedidos y tus puntos. No se puede deshacer.
        </p>
      </section>
    </div>
  );
};

export default PrivacySecurity;
