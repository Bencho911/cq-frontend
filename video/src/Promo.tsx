import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TransitionSeries, springTiming } from '@remotion/transitions';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { S1Hook, S2Order, S3Custom, S4Album, S5Ready, S6Montage, S7End } from './scenes';
import { SMOOTH, zocaloBg } from './theme';
import { SoundTrack, VoiceTrack } from './Sfx';

/**
 * Transición de marca: la escena nueva sube como una fachada y el zócalo
 * rojo y azul tinta viaja en su borde superior.
 */
const ZocaloWipeComp: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  if (presentationDirection === 'exiting') {
    // La escena que sale se aleja un poco: da profundidad sin robar atención.
    return (
      <AbsoluteFill style={{ transform: `scale(${1 - presentationProgress * 0.04})`, filter: `brightness(${1 - presentationProgress * 0.25})` }}>
        {children}
      </AbsoluteFill>
    );
  }
  const top = (1 - presentationProgress) * 100;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(${top}% 0 0 0)` }}>{children}</AbsoluteFill>
      {presentationProgress < 1 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: `calc(${top}% - 28px)`, height: 28, background: zocaloBg }} />
      )}
    </AbsoluteFill>
  );
};

const zocaloWipe = (): TransitionPresentation<Record<string, never>> => ({ component: ZocaloWipeComp, props: {} });

const T = 15;
const timing = springTiming({ config: SMOOTH, durationInFrames: T });

/** Duraciones de cada escena (las transiciones se solapan T cuadros). */
const SCENES: [React.FC, number][] = [
  // Duraciones ajustadas a la voz (public/vo/voz.mp3): cada escena entra
  // ~0,35 s antes de su frase, para que la transición termine al hablar.
  [S1Hook, 133], //   0,0 s  ¿Antojo de un buen café del Quindío?…
  [S2Order, 122], //  3,9 s  Pídelo antes de llegar…
  [S3Custom, 133], // 7,5 s  Grande, frío, con un espresso extra…
  [S4Album, 227], // 11,4 s  Y en cada pedido sumas puntos…
  [S5Ready, 87], //  18,5 s  Cuando esté listo, te avisamos.
  [S6Montage, 103], // 20,9 s Menú, pedidos y puntos…
  [S7End, 185], //   23,8 s  Café Quindío, el café del corazón de Colombia…
];

export const PROMO_DURATION = SCENES.reduce((s, [, d]) => s + d, 0) - T * (SCENES.length - 1);

/** Cuadro en que empieza cada escena (incluye el solape de la transición). */
const SCENE_STARTS = SCENES.map((_, i) => SCENES.slice(0, i).reduce((s, [, d]) => s + d, 0) - T * i);

export const Promo: React.FC = () => (
  <AbsoluteFill style={{ background: '#fff' }}>
    <TransitionSeries>
      {SCENES.flatMap(([Scene, d], i) => {
        const items = [
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={d}>
            <Scene />
          </TransitionSeries.Sequence>,
        ];
        if (i < SCENES.length - 1) {
          items.push(<TransitionSeries.Transition key={`t${i}`} presentation={zocaloWipe()} timing={timing} />);
        }
        return items;
      })}
    </TransitionSeries>
    <SoundTrack sceneStarts={SCENE_STARTS} />
    <VoiceTrack />
  </AbsoluteFill>
);
