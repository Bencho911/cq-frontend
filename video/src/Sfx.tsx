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

const files: Partial<Record<SfxId, string>> = manifest.files;

/**
 * Voz en off (guion-voz.md), un archivo por escena en public/vo. `at` es el
 * cuadro dentro de la escena en que entra; varios llevan un pequeño
 * retraso para que la frase anterior termine o para dejar sonar un efecto.
 */
const VOICE: { file: string; scene: number; at: number }[] = [
  { file: 'vo-1.mp3', scene: 0, at: 0 },
  { file: 'vo-2.mp3', scene: 1, at: 15 },
  { file: 'vo-3.mp3', scene: 2, at: 6 },
  { file: 'vo-4.mp3', scene: 3, at: -3 },
  { file: 'vo-5.mp3', scene: 4, at: 20 },
];

/** Los efectos bajan a este factor mientras hay voz, para que se entienda. */
const DUCK = 0.55;
const VOICE_VOLUME = 0.9;

/**
 * Pista de efectos. Solo programa los sonidos listados en manifest.json,
 * así el video se puede renderizar aunque falte alguno.
 */
export const SoundTrack: React.FC<{ sceneStarts: number[] }> = ({ sceneStarts }) => {
  const transitions: Cue[] = sceneStarts.slice(1).map((_, i) => ({ scene: i + 1, at: 0, id: 'whoosh', volume: 0.45 }));
  return (
    <>
      {[...transitions, ...CUES]
        .filter((c) => files[c.id])
        .map((c, i) => (
          <Sequence key={i} from={sceneStarts[c.scene] + c.at} layout="none">
            <Audio src={staticFile(`sfx/${files[c.id]}`)} volume={c.volume * (VOICE.length > 0 ? DUCK : 1)} />
          </Sequence>
        ))}
    </>
  );
};

export const VoiceTrack: React.FC<{ sceneStarts: number[] }> = ({ sceneStarts }) => (
  <>
    {VOICE.map((v) => (
      <Sequence key={v.file} from={sceneStarts[v.scene] + v.at} layout="none">
        <Audio src={staticFile(`vo/${v.file}`)} volume={VOICE_VOLUME} />
      </Sequence>
    ))}
  </>
);
