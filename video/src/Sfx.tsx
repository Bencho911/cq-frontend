import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import manifest from '../public/sfx/manifest.json';
import { TIMING } from './scenes';

/** Efectos del catálogo (scripts/sfx-catalog.json). */
type SfxId = 'whoosh' | 'tap' | 'pop' | 'stamp' | 'rise' | 'notification' | 'reward' | 'logo';

interface Cue {
  scene: number;
  /** Cuadro dentro de la escena, el mismo que usa su animación. */
  at: number;
  id: SfxId;
  volume: number;
}

const { custom, album, ready, order } = TIMING;

const CUES: Cue[] = [
  { scene: 0, at: 8, id: 'rise', volume: 0.55 },
  { scene: 1, at: order.tap, id: 'tap', volume: 0.8 },
  { scene: 2, at: custom.tap, id: 'tap', volume: 0.8 },
  { scene: 2, at: custom.frio, id: 'pop', volume: 0.45 },
  { scene: 2, at: custom.grande, id: 'pop', volume: 0.45 },
  { scene: 2, at: custom.espresso, id: 'pop', volume: 0.45 },
  // Cada estampilla suena al aterrizar.
  ...[0, 1, 2, 3, 4].map((i) => ({ scene: 3, at: album.firstStamp + i * album.every + album.land, id: 'stamp' as const, volume: 0.75 })),
  { scene: 3, at: album.firstStamp + album.every * 5 + 6, id: 'reward', volume: 0.6 },
  { scene: 4, at: ready.note, id: 'notification', volume: 0.8 },
  { scene: 4, at: ready.card, id: 'reward', volume: 0.55 },
  { scene: 6, at: 4, id: 'logo', volume: 0.8 },
];

const files: Partial<Record<SfxId, string>> = manifest.files;

/** Voz en off en una sola toma (guion-voz.md), desde el primer cuadro. */
const VOICE = [{ file: 'voz.mp3', at: 0 }];

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

export const VoiceTrack: React.FC = () => (
  <>
    {VOICE.map((v) => (
      <Sequence key={v.file} from={v.at} layout="none">
        <Audio src={staticFile(`vo/${v.file}`)} volume={VOICE_VOLUME} />
      </Sequence>
    ))}
  </>
);
