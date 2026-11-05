# Guion de voz · Promo Café Quindío (30 s)

## Versión actual: una sola toma continua

Se genera completo en una sola toma (misma voz, español, Eleven v3 o v4).
Los saltos de línea dan las pausas; debe durar entre 27 y 30 s. Las escenas
se ajustan a la voz, no al revés.

```
¿Antojo de un buen café del Quindío? Ahora lo tienes a un toque.
Pídelo antes de llegar y recógelo en la barra, sin hacer fila.
Grande, frío, con un espresso extra… como a ti te gusta.
Y en cada pedido sumas puntos: cada diez, un ave nueva para tu álbum, y con cincuenta, el café va por nuestra cuenta.
Cuando esté listo, te avisamos.
Menú, pedidos y puntos, todo en una sola app.
Café Quindío, el café del corazón de Colombia. Pide el tuyo desde la app.
```

## Música de fondo (ElevenLabs → Música)

Instrumental, 30 s, para ir por debajo de la voz:

```
Warm, upbeat Colombian acoustic background music for a coffee app ad. Tiple and nylon guitar strumming, soft marimba melody, light hand percussion (shaker, cajón). Bright, friendly and relaxed, 100 BPM, major key. Instrumental only, no vocals. Leave space for a voiceover: simple, uncluttered arrangement. Clear ending on a final strum at 30 seconds.
```

---

## Versión anterior (por bloques, descartada: se notaban los cortes)


Medido para los tiempos del video (`src/Promo.tsx`). Ritmo objetivo: unas
2,5 palabras por segundo, con silencios para que respiren los efectos.

| # | Tiempo | Escena en pantalla | Texto de la voz | Palabras |
|---|---|---|---|---|
| 1 | 0,0–3,0 s | "El café del Quindío, a un toque." | El café del Quindío… ahora, a un toque. | 7 |
| 2 | 3,0–7,0 s | Inicio, toque en "Pedir por" | Pide antes de llegar. Recógelo sin hacer fila. | 8 |
| 3 | 7,0–11,5 s | Detalle con el arco, "Grande" | Grande, frío, con espresso extra: como a ti te gusta. | 10 |
| 4 | 11,5–17,0 s | Estampillas y contador | Cada pedido suma puntos. Cada diez, un ave. Con cincuenta, invitamos nosotros. | 13 |
| 5 | 17,0–21,5 s | Notificación "Tu pedido está listo" | Y cuando esté listo, te avisamos. | 6 |
| 6 | 21,5–24,5 s | Tres teléfonos | Menú, pedidos y puntos, en una sola app. | 8 |
| 7 | 24,5–30,0 s | Logo y eslogan | Café Quindío. El café del corazón de Colombia. Pídelo desde la app. | 11 |

## Para ElevenLabs

- **Voz:** cálida, cercana, con una sonrisa en la voz; acento colombiano
  suave; 25–40 años. Que suene a alguien de la tienda, no a locutor de radio.
- **Modelo:** Eleven v3 si quieres más expresión; Multilingual v2 si buscas
  una lectura más estable.
- **Ajustes de partida:** estabilidad 50 %, similitud 75 %, estilo 20–30 %,
  velocidad 1,0 (bájala a 0,95 si algún bloque se pasa de tiempo).
- **Genera un archivo por bloque** (`vo-1` … `vo-7`), no todo junto: así cada
  frase se coloca exactamente al inicio de su escena y se puede regrabar una
  sola sin tocar las demás.
- **Pronunciación:** "Quindío" con tilde en la í (kin-DÍ-o). Si la voz duda,
  escríbelo "Quindío" sin cambios y prueba otra toma antes de deformarlo.

### Texto con etiquetas para Eleven v3 (opcional)

1. [warm] El café del Quindío… ahora, a un toque.
2. Pide antes de llegar. Recógelo sin hacer fila.
3. [playful] Grande, frío, con espresso extra: como a ti te gusta.
4. Cada pedido suma puntos. Cada diez, un ave. [excited] Con cincuenta, invitamos nosotros.
5. [softly] Y cuando esté listo, te avisamos.
6. Menú, pedidos y puntos, en una sola app.
7. [warm] Café Quindío. El café del corazón de Colombia. [cheerful] Pídelo desde la app.

## Cuando tengas los audios

Guárdalos en `public/vo/vo-1.mp3` … `vo-7.mp3` (o pásamelos) y los coloco al
inicio de cada escena, bajando un poco los efectos mientras habla la voz.
