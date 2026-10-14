# Promo Café Quindío (Remotion)

Video promocional vertical de 30 s (1080×1920, 30 fps) de la app, con las
capturas reales de las pantallas y los artes corporativos.

## Escenas

| Tiempo | Escena | Archivo |
|---|---|---|
| 0–3,5 s | Gancho: "El café del Quindío, a un toque." | `S1Hook` |
| 3,5–8 s | Pide antes de llegar (Inicio, toque en "Pedir por") | `S2Order` |
| 8–13 s | Como te gusta (detalle con arco, toque en Grande) | `S3Custom` |
| 13–19 s | Cada 10 puntos, un ave (estampillas + contador) | `S4Album` |
| 19–24 s | Tu pedido está listo (notificación + premio) | `S5Ready` |
| 24–27 s | Menú, pedidos y puntos (tres teléfonos) | `S6Montage` |
| 27–30 s | Cierre con logo, eslogan y llamado a la acción | `S7End` |

Las escenas están en `src/scenes.tsx`; la transición de marca (la escena
nueva sube con el zócalo en el borde) en `src/Promo.tsx`.

## Comandos

```bash
npm install
npm run dev                      # Remotion Studio, para ver y ajustar
npx remotion render PromoCafeQuindio out/promo-cafe-quindio.mp4 --codec=h264 --crf=18
```

En entornos sin Chrome compatible, agrega
`--browser-executable=<ruta a chrome-headless-shell>`.

## Activos

- `public/screens/`: capturas 3× de la app (`/home`, `/menu`, detalle,
  carrito, `/album`, pedido listo). Si la app cambia, vuelve a capturarlas.
- `public/brand/` y `public/fonts/`: los mismos de la app. Neutra Text es
  comercial: confirmar la licencia antes de publicar el video.
- El video no tiene audio todavía.
