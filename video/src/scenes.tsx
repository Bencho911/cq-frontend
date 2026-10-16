import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { BOUNCY, C, FONT_DISPLAY, FONT_NUM, FONT_SANS, SMOOTH } from './theme';
import { KineticTitle, Phone, Stamp, Tap, useEnter, Zocalo } from './components';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/**
 * Momentos clave de cada escena, en cuadros desde su inicio. Están
 * alineados con la voz (public/vo/voz.mp3) y Sfx.tsx los usa para que cada
 * efecto suene con su animación.
 */
export const TIMING = {
  order: { tap: 70 },
  custom: { tap: 28, frio: 34, grande: 40, espresso: 56 },
  // Las estampillas caen con "cada diez, un ave" y el premio con "con cincuenta".
  album: { firstStamp: 58, every: 16, land: 10 },
  ready: { note: 2, title: 8, art: 10, zocalo: 6, card: 44 },
};

/** Empuje de cámara lento y constante: da vida sin distraer. */
const Push: React.FC<{ from?: number; to?: number; duration: number; children: React.ReactNode }> = ({
  from = 1,
  to = 1.05,
  duration,
  children,
}) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, duration], [from, to], clamp);
  return <AbsoluteFill style={{ transform: `scale(${s})` }}>{children}</AbsoluteFill>;
};

const Body: React.FC<{ children: React.ReactNode; delay: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  delay,
  color = C.ink,
  style,
}) => {
  const p = useEnter(delay);
  return (
    <div
      style={{
        fontFamily: FONT_SANS,
        fontSize: 46,
        lineHeight: 1.3,
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 24}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ───────────── 1 · Gancho ───────────── */
export const S1Hook: React.FC = () => {
  const logo = useEnter(0);
  const win = useEnter(10, SMOOTH, 34);
  return (
    <AbsoluteFill style={{ background: C.verde }}>
      <Push duration={105} to={1.04}>
        <Img
          src={staticFile('brand/logo-blanco.webp')}
          style={{ position: 'absolute', left: 90, top: 150, height: 74, opacity: logo }}
        />
        <KineticTitle
          lines={['El café', 'del Quindío,', 'a un toque.']}
          delay={6}
          size={168}
          color={C.white}
          style={{ position: 'absolute', left: 84, top: 330 }}
        />
        {/* La ilustración sube desde detrás del zócalo */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 820, height: 680, overflow: 'hidden' }}>
          <Img
            src={staticFile('brand/ventana-tucan.webp')}
            style={{
              position: 'absolute',
              left: '50%',
              bottom: -4,
              width: 720,
              transform: `translate(-50%, ${(1 - win) * 105}%)`,
            }}
          />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1500, bottom: 0, background: C.mostaza }} />
        <Zocalo top={1500} delay={0} />
      </Push>
    </AbsoluteFill>
  );
};

/* ───────────── 2 · Pide antes de llegar ───────────── */
export const S2Order: React.FC = () => {
  const frame = useCurrentFrame();
  const phone = useEnter(8, SMOOTH, 30);
  const lift = interpolate(frame, [60, 120], [0, -50], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <KineticTitle lines={['Pide antes', 'de llegar.']} delay={4} size={150} style={{ position: 'absolute', left: 84, top: 150 }} />
      <Body delay={22} style={{ position: 'absolute', left: 90, top: 470, width: 860 }}>
        Lo de siempre, en un toque. Lo recoges en la barra, sin fila.
      </Body>
      <div style={{ position: 'absolute', left: 160, top: 720 + (1 - phone) * 1300 + lift }}>
        <Phone src="home.jpg" width={760}>
          <Tap x={98} y={294} at={TIMING.order.tap} phoneWidth={760} />
        </Phone>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 3 · Como te gusta ───────────── */
const Tag: React.FC<{ label: string; delay: number; x: number; y: number; dark?: boolean }> = ({ label, delay, x, y, dark }) => {
  const p = useEnter(delay, BOUNCY);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        padding: '22px 34px',
        borderRadius: 14,
        background: dark ? C.ink : C.white,
        color: dark ? C.white : C.ink,
        fontFamily: FONT_SANS,
        fontWeight: 700,
        fontSize: 44,
        boxShadow: '0 20px 40px rgba(24,48,60,.22)',
        opacity: Math.min(1, p * 1.5),
        transform: `scale(${0.9 + p * 0.1}) translateY(${(1 - p) * 30}px)`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  );
};

export const S3Custom: React.FC = () => {
  const frame = useCurrentFrame();
  const phone = useEnter(6, SMOOTH, 30);
  const swap = interpolate(frame, [TIMING.custom.tap + 2, TIMING.custom.tap + 8], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.mostaza }}>
      <KineticTitle lines={['Como te', 'gusta.']} delay={4} size={150} style={{ position: 'absolute', left: 84, top: 150 }} />
      <Img src={staticFile('brand/cafe-rama.webp')} style={{ position: 'absolute', right: 40, top: 150, width: 300, opacity: useEnter(14) }} />
      <div style={{ position: 'absolute', left: 200, top: 560 + (1 - phone) * 1300 }}>
        <Phone src="detail-mediano.jpg" width={680}>
          <Img
            src={staticFile('screens/detail-grande.jpg')}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: swap }}
          />
          <Tap x={313} y={521} at={TIMING.custom.tap} phoneWidth={680} />
        </Phone>
      </div>
      <Tag label="Frío" delay={TIMING.custom.frio} x={50} y={760} />
      <Tag label="Grande, 20 oz" delay={TIMING.custom.grande} x={30} y={1330} dark />
      <Tag label="+ Espresso extra" delay={TIMING.custom.espresso} x={500} y={1660} />
    </AbsoluteFill>
  );
};

/* ───────────── 4 · Cada 10 puntos, un ave ───────────── */
const BIRDS = [
  { src: 'ave-tucan.webp', color: C.white, x: 70, y: 980, r: -6 },
  { src: 'ave-toche.webp', color: C.teal, x: 395, y: 940, r: 3 },
  { src: 'ave-loro.webp', color: C.rosaSoft, x: 720, y: 990, r: 7 },
  { src: 'ave-martin.webp', color: C.mostazaSoft, x: 230, y: 1380, r: -4 },
  { src: 'ave-barranquero.webp', color: C.mostaza, x: 560, y: 1370, r: 5 },
];
const STAMP_EVERY = TIMING.album.every;
const FIRST_STAMP = TIMING.album.firstStamp;

export const S4Album: React.FC = () => {
  const frame = useCurrentFrame();
  // El contador sube 10 puntos por cada estampilla que aterriza.
  const points = Math.round(
    interpolate(frame, [FIRST_STAMP, FIRST_STAMP + STAMP_EVERY * 5], [0, 50], { ...clamp, easing: Easing.out(Easing.quad) }),
  );
  const reward = useEnter(FIRST_STAMP + STAMP_EVERY * 5 + 6, BOUNCY);
  return (
    <AbsoluteFill style={{ background: C.rosa }}>
      <KineticTitle lines={['Cada 10 puntos,', 'un ave.']} delay={2} size={132} style={{ position: 'absolute', left: 84, top: 150 }} />
      <div style={{ position: 'absolute', left: 90, top: 470, display: 'flex', alignItems: 'baseline', gap: 24 }}>
        <span style={{ fontFamily: FONT_NUM, fontWeight: 600, fontSize: 210, lineHeight: 1, color: C.ink, fontVariantNumeric: 'tabular-nums' }}>
          {points}
        </span>
        <span style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 56, color: C.ink }}>puntos</span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 735,
          padding: '18px 30px',
          borderRadius: 12,
          background: C.ink,
          color: C.white,
          fontFamily: FONT_SANS,
          fontWeight: 700,
          fontSize: 46,
          opacity: Math.min(1, reward * 1.4),
          transform: `scale(${0.92 + reward * 0.08})`,
          transformOrigin: 'left center',
        }}
      >
        50 = tu bebida gratis
      </div>
      {BIRDS.map((b, i) => {
        const delay = FIRST_STAMP + i * STAMP_EVERY;
        const p = enterAt(frame, delay);
        // La última ave llega como silueta y se colorea al completar la tarjeta.
        const silhouette = i === 4 ? interpolate(frame, [delay + 14, delay + 26], [1, 0], clamp) : 0;
        return (
          <div
            key={b.src}
            style={{
              position: 'absolute',
              left: b.x,
              top: b.y,
              opacity: Math.min(1, p * 2),
              transform: `translateY(${(1 - p) * 520}px) rotate(${b.r + (1 - p) * 18}deg) scale(${1.15 - p * 0.15})`,
            }}
          >
            <Stamp src={b.src} color={b.color} width={290} height={350} silhouette={silhouette} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Variante sin hook, para usar dentro de .map con el mismo cuadro.
function enterAt(frame: number, delay: number) {
  return spring({ frame: frame - delay, fps: 30, config: BOUNCY });
}

/* ───────────── 5 · Tu pedido está listo ───────────── */
export const S5Ready: React.FC = () => {
  const t = TIMING.ready;
  const note = useEnter(t.note, SMOOTH, 26);
  const card = useEnter(t.card, BOUNCY);
  const art = useEnter(t.art, SMOOTH, 30);
  return (
    <AbsoluteFill style={{ background: C.verde }}>
      {/* Notificación */}
      <div
        style={{
          position: 'absolute',
          left: 50,
          right: 50,
          top: 110,
          padding: '30px 34px',
          borderRadius: 34,
          background: 'rgba(255,255,255,.96)',
          display: 'flex',
          gap: 26,
          alignItems: 'center',
          transform: `translateY(${(1 - note) * -260}px)`,
          boxShadow: '0 24px 60px rgba(0,0,0,.25)',
        }}
      >
        <div style={{ width: 96, height: 96, borderRadius: 22, background: C.mostaza, display: 'grid', placeItems: 'center', flex: 'none' }}>
          <Img src={staticFile('brand/ave-toche.webp')} style={{ height: 76 }} />
        </div>
        <div style={{ fontFamily: FONT_SANS, color: C.ink }}>
          <div style={{ fontSize: 34, color: C.ink2 }}>Café Quindío, ahora</div>
          <div style={{ fontSize: 42, fontWeight: 700, marginTop: 4 }}>Tu pedido está listo</div>
          <div style={{ fontSize: 36, marginTop: 2 }}>Recógelo en la barra de la Tienda Centro.</div>
        </div>
      </div>
      <KineticTitle lines={['Tu pedido', 'está listo.']} delay={t.title} size={170} color={C.white} style={{ position: 'absolute', left: 84, top: 470 }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 860, height: 640, overflow: 'hidden' }}>
        <Img
          src={staticFile('brand/puerta-capibara.webp')}
          style={{ position: 'absolute', right: 70, bottom: -4, width: 470, transform: `translateY(${(1 - art) * 105}%)` }}
        />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1500, bottom: 0, background: C.mostaza }} />
      <Zocalo top={1500} delay={t.zocalo} />
      {/* Premio */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 1160,
          width: 640,
          padding: 28,
          borderRadius: 16,
          background: C.white,
          display: 'flex',
          gap: 28,
          alignItems: 'center',
          opacity: Math.min(1, card * 1.5),
          transform: `translateY(${(1 - card) * 80}px)`,
          boxShadow: '0 30px 60px rgba(24,48,60,.3)',
        }}
      >
        <Stamp src="ave-barranquero.webp" color={C.mostaza} width={150} height={182} style={{ filter: 'none', flex: 'none' }} />
        <div style={{ fontFamily: FONT_SANS, color: C.ink }}>
          <div style={{ fontFamily: FONT_NUM, fontSize: 64, fontWeight: 600 }}>+11 puntos</div>
          <div style={{ fontSize: 38, color: C.ink2, lineHeight: 1.25 }}>Ganaste al Barranquero y una bebida gratis</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 6 · Todo en una app ───────────── */
export const S6Montage: React.FC = () => {
  const frame = useCurrentFrame();
  const pan = interpolate(frame, [0, 105], [140, -140], clamp);
  const enter = useEnter(0, SMOOTH, 28);
  const phones = [
    { src: 'menu.jpg', x: -330, ry: 22, s: 0.86, z: 0 },
    { src: 'album.jpg', x: 0, ry: 0, s: 1, z: 2 },
    { src: 'checkout.jpg', x: 330, ry: -22, s: 0.86, z: 0 },
  ];
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <KineticTitle lines={['Menú, pedidos', 'y puntos.']} delay={2} size={120} color={C.white} style={{ position: 'absolute', left: 84, top: 150 }} />
      <Body delay={18} color={C.onDark} style={{ position: 'absolute', left: 90, top: 420 }}>
        Todo en una app.
      </Body>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 640, height: 1280, perspective: 2400 }}>
        {phones.map((ph, i) => (
          <div
            key={ph.src}
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              zIndex: ph.z,
              transform: `translateX(calc(-50% + ${ph.x + pan * (i === 1 ? 0.6 : 1)}px)) translateY(${(1 - enter) * (600 + i * 120)}px) rotateY(${ph.ry}deg) scale(${ph.s})`,
              transformOrigin: 'center top',
            }}
          >
            <Phone src={ph.src} width={560} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 7 · Cierre ───────────── */
export const S7End: React.FC = () => {
  const logo = useEnter(4, SMOOTH, 30);
  const slogan = useEnter(18);
  const cta = useEnter(34, BOUNCY);
  const art = useEnter(10, SMOOTH, 34);
  return (
    <AbsoluteFill style={{ background: C.verde }}>
      <Push duration={165} to={1.03}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 330, display: 'grid', justifyItems: 'center' }}>
          <Img
            src={staticFile('brand/logo-blanco.webp')}
            style={{ width: 760, opacity: logo, transform: `scale(${0.94 + logo * 0.06})` }}
          />
          <Img
            src={staticFile('brand/slogan-blanco.webp')}
            style={{ width: 640, marginTop: 70, opacity: slogan, transform: `translateY(${(1 - slogan) * 20}px)` }}
          />
          <div
            style={{
              marginTop: 90,
              padding: '30px 54px',
              borderRadius: 14,
              background: C.mostaza,
              color: C.ink,
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 64,
              letterSpacing: '-0.03em',
              opacity: Math.min(1, cta * 1.4),
              transform: `scale(${0.9 + cta * 0.1})`,
            }}
          >
            Pídelo desde la app
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1060, height: 440, overflow: 'hidden' }}>
          <Img
            src={staticFile('brand/ventana-ave.webp')}
            style={{ position: 'absolute', left: '50%', bottom: -4, width: 420, transform: `translate(-50%, ${(1 - art) * 105}%)` }}
          />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1500, bottom: 0, background: C.mostaza }} />
        <Zocalo top={1500} delay={0} />
      </Push>
    </AbsoluteFill>
  );
};
