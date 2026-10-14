import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import manifest from '../public/sfx/manifest.json';

/** Efectos del catálogo (scripts/sfx-catalog.json). */
type SfxId = 'whoosh' | 'tap' | 'pop' | 'stamp' | 'rise' | 'notification' | 'reward' | 'logo';

interface Cue {
  scene: number;
  /** Cuadro dentro de la escena, el mismo que usa su animación. */
  at: number;
  id: SfxId;
  volume: number;
}

// Mismos tiempos que las animaciones de src/scenes.tsx.
const STAMP_FIRST = 26;
const STAMP_EVERY = 22;

const CUES: Cue[] = [
  { scene: 0, at: 8, id: 'rise', volume: 0.55 },
  { scene: 1, at: 70, id: 'tap', volume: 0.8 },
  { scene: 2, at: 40, id: 'pop', volume: 0.45 },
  { scene: 2, at: 72, id: 'tap', volume: 0.8 },
  { scene: 2, at: 84, id: 'pop', volume: 0.45 },
  { scene: 2, at: 100, id: 'pop', volume: 0.45 },
  // Cada estampilla suena al aterrizar (~10 cuadros después de salir).
  ...[0, 1, 2, 3, 4].map((i) => ({ scene: 3, at: STAMP_FIRST + i * STAMP_EVERY + 10, id: 'stamp' as const, volume: 0.75 })),
  { scene: 3, at: STAMP_FIRST + STAMP_EVERY * 5 + 6, id: 'reward', volume: 0.6 },
  { scene: 4, at: 6, id: 'notification', volume: 0.8 },
  { scene: 4, at: 92, id: 'reward', volume: 0.55 },
  { scene: 6, at: 4, id: 'logo', volume: 0.8 },
];

const available = new Set<string>(manifest.available);

/**
 * Pista de efectos. Solo programa los sonidos ya generados (manifest.json),
 * así el video se puede renderizar aunque falte alguno.
 */
export const SoundTrack: React.FC<{ sceneStarts: number[] }> = ({ sceneStarts }) => {
  const transitions: Cue[] = sceneStarts.slice(1).map((_, i) => ({ scene: i + 1, at: 0, id: 'whoosh', volume: 0.45 }));
  return (
    <>
      {[...transitions, ...CUES]
        .filter((c) => available.has(c.id))
        .map((c, i) => (
          <Sequence key={i} from={sceneStarts[c.scene] + c.at} layout="none">
            <Audio src={staticFile(`sfx/${c.id}.mp3`)} volume={c.volume} />
          </Sequence>
        ))}
    </>
  );
};
