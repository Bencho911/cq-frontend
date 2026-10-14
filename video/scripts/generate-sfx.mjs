/**
 * Genera los efectos de sonido del video con ElevenLabs (Text to Sound
 * Effects) y los guarda en public/sfx/<id>.mp3.
 *
 * Uso:
 *   ELEVENLABS_API_KEY=... npm run sfx            # genera los que faltan
 *   ELEVENLABS_API_KEY=... npm run sfx -- tap pop # regenera esos ids
 *
 * La clave se lee solo de la variable de entorno; nunca va en el código.
 * El render del video no llama a ElevenLabs: usa los .mp3 ya generados.
 */
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import { createWriteStream } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'sfx');
const catalog = JSON.parse(readFileSync(join(root, 'scripts', 'sfx-catalog.json'), 'utf8'));
delete catalog._comment;

if (!process.env.ELEVENLABS_API_KEY) {
  console.error('Falta ELEVENLABS_API_KEY en el entorno.');
  process.exit(1);
}

const requested = process.argv.slice(2);
const ids = requested.length > 0 ? requested : Object.keys(catalog).filter((id) => !existsSync(join(outDir, `${id}.mp3`)));
const unknown = ids.filter((id) => !catalog[id]);
if (unknown.length > 0) {
  console.error(`No existen en el catálogo: ${unknown.join(', ')}`);
  process.exit(1);
}

const client = new ElevenLabsClient();
for (const id of ids) {
  const { text, durationSeconds, promptInfluence } = catalog[id];
  process.stdout.write(`Generando ${id}… `);
  const audio = await client.textToSoundEffects.convert({ text, durationSeconds, promptInfluence, outputFormat: 'mp3_44100_128' });
  await finished(Readable.fromWeb(audio).pipe(createWriteStream(join(outDir, `${id}.mp3`))));
  console.log('listo');
}

// El video solo programa los sonidos que existen en este manifiesto.
const available = Object.keys(catalog).filter((id) => existsSync(join(outDir, `${id}.mp3`)));
writeFileSync(join(outDir, 'manifest.json'), JSON.stringify({ available }, null, 2) + '\n');
console.log(`Disponibles: ${available.join(', ') || 'ninguno'}`);
