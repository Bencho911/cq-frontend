import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

/** Paleta «Fachadas»: la misma de la app (src/index.css del repo). */
export const C = {
  ink: '#18303C',
  ink2: '#4E5F68',
  white: '#FFFFFF',
  mostaza: '#E6A90E',
  mostazaSoft: '#F8E7B6',
  rosa: '#E66C92',
  rosaSoft: '#F8DCE5',
  teal: '#62AAA9',
  tealSoft: '#DDEEEC',
  verde: '#1D6B64',
  rojo: '#C2391F',
  onDark: '#D7ECE9',
};

export const FONT_DISPLAY = 'Bricolage Grotesque';
export const FONT_SANS = 'Neutra Text';
export const FONT_NUM = 'Neutra Text TF';

// loadFont bloquea el render hasta que la fuente está lista.
loadFont({ family: FONT_DISPLAY, url: staticFile('fonts/BricolageGrotesque.woff2'), weight: '200 800' });
loadFont({ family: FONT_SANS, url: staticFile('fonts/NeutraText-Book.woff2'), weight: '400' });
loadFont({ family: FONT_SANS, url: staticFile('fonts/NeutraText-Demi.woff2'), weight: '600' });
loadFont({ family: FONT_SANS, url: staticFile('fonts/NeutraText-Bold.woff2'), weight: '700' });
loadFont({ family: FONT_NUM, url: staticFile('fonts/NeutraTextTF-Demi.woff2'), weight: '600' });

export const FPS = 30;
export const W = 1080;
export const H = 1920;

/** Resorte sin rebote para entradas de interfaz. */
export const SMOOTH = { damping: 200 } as const;
/** Resorte con un leve rebote, solo para momentos de celebración. */
export const BOUNCY = { damping: 14, stiffness: 120, mass: 0.9 } as const;

export const zocaloBg = `repeating-linear-gradient(90deg, ${C.rojo} 0 84px, ${C.ink} 84px 96px)`;
