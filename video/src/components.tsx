import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT_DISPLAY, SMOOTH, zocaloBg } from './theme';

/** Avance 0→1 de un resorte que empieza en `delay`. */
export function useEnter(delay = 0, config: Record<string, number> = SMOOTH, durationInFrames?: number) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config, durationInFrames });
}

/**
 * Titular cinético: cada palabra sube desde detrás de una máscara, con
 * 3 cuadros de desfase. Una sola entrada orquestada por escena.
 */
export const KineticTitle: React.FC<{
  lines: string[];
  delay?: number;
  size?: number;
  color?: string;
  stagger?: number;
  style?: React.CSSProperties;
}> = ({ lines, delay = 0, size = 140, color = C.ink, stagger = 3, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let i = 0;
  return (
    <div
      style={{
        fontFamily: FONT_DISPLAY,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 0.92,
        letterSpacing: '-0.045em',
        color,
        fontVariationSettings: '"opsz" 96',
        ...style,
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{ display: 'block' }}>
          {line.split(' ').map((word, wi) => {
            const p = spring({ frame: frame - delay - i++ * stagger, fps, config: SMOOTH });
            return (
              <span key={wi} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em' }}>
                <span style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)` }}>
                  {word}
                  {wi < line.split(' ').length - 1 ? ' ' : ''}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Zócalo rojo y azul tinta que se dibuja de izquierda a derecha. */
export const Zocalo: React.FC<{ top: number; delay?: number; height?: number }> = ({ top, delay = 0, height = 28 }) => {
  const p = useEnter(delay, SMOOTH, 24);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        height,
        background: zocaloBg,
        transformOrigin: 'left center',
        transform: `scaleX(${p})`,
      }}
    />
  );
};

/** Teléfono: la captura real de la app con un borde fino en azul tinta. */
export const Phone: React.FC<{
  src: string;
  width?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ src, width = 760, style, children }) => {
  const height = (width * 2532) / 1170;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: width * 0.105,
        overflow: 'hidden',
        background: C.white,
        boxShadow: `0 0 0 ${Math.round(width * 0.018)}px ${C.ink}, 0 70px 140px rgba(24,48,60,.32)`,
        ...style,
      }}
    >
      <Img src={staticFile(`screens/${src}`)} style={{ width: '100%', height: '100%', display: 'block' }} />
      {children}
    </div>
  );
};

/**
 * Toque: un círculo que se expande y desvanece donde se tocó. Las
 * coordenadas van en puntos de la pantalla de 390 de ancho.
 */
export const Tap: React.FC<{ x: number; y: number; at: number; phoneWidth: number }> = ({ x, y, at, phoneWidth }) => {
  const frame = useCurrentFrame();
  const k = phoneWidth / 390;
  const t = frame - at;
  if (t < -6 || t > 22) return null;
  const press = interpolate(t, [-6, 0, 4], [0, 1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ring = interpolate(t, [0, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x * k - 34,
          top: y * k - 34,
          width: 68,
          height: 68,
          borderRadius: 34,
          background: 'rgba(255,255,255,.85)',
          border: `5px solid ${C.ink}`,
          opacity: t < 4 ? press : interpolate(t, [4, 14], [1, 0], { extrapolateRight: 'clamp' }),
          transform: `scale(${t < 0 ? 1.2 - press * 0.2 : 1 - Math.min(t, 4) * 0.03})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x * k - 34,
          top: y * k - 34,
          width: 68,
          height: 68,
          borderRadius: 34,
          border: `4px solid ${C.ink}`,
          opacity: (1 - ring) * 0.8,
          transform: `scale(${1 + ring * 2.2})`,
        }}
      />
    </>
  );
};

/** Estampilla perforada con un ave (forma de la lealtad en la app). */
export const Stamp: React.FC<{
  src: string;
  color: string;
  width: number;
  height: number;
  silhouette?: number;
  style?: React.CSSProperties;
}> = ({ src, color, width, height, silhouette = 0, style }) => {
  const r = Math.round(width * 0.03);
  return (
    <div
      style={{
        width,
        height,
        padding: 2 * r,
        background: `radial-gradient(${r}px, #0000 97%, ${color}) round ${-1.5 * r}px ${-1.5 * r}px / ${3 * r}px ${3 * r}px, linear-gradient(${color} 0 0) no-repeat 50% / calc(100% - ${3 * r}px) calc(100% - ${3 * r}px)`,
        filter: 'drop-shadow(0 24px 30px rgba(24,48,60,.22))',
        ...style,
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <Img src={staticFile(`brand/${src}`)} style={{ position: 'absolute', inset: '6%', width: '88%', height: '88%', objectFit: 'contain' }} />
        {silhouette > 0 && (
          <Img
            src={staticFile(`brand/${src}`)}
            style={{ position: 'absolute', inset: '6%', width: '88%', height: '88%', objectFit: 'contain', filter: 'brightness(0)', opacity: silhouette * 0.85 }}
          />
        )}
      </div>
    </div>
  );
};
