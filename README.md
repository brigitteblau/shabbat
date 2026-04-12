# SHABBES
Una web en Astro que muestra horarios reales de Shabbat con una estética cálida, minimalista y “cute”.

## Correr en local
```bash
npm install
npm run dev
```

Luego abrí el URL que te imprime Astro (por defecto `http://localhost:4321`).

## Archivos clave
- `astro.config.mjs`: configuración de Astro + integración de Tailwind.
- `tailwind.config.mjs`: paleta cálida (cream / soft orange / terracotta) + sombras suaves.
- `src/styles/global.css`: Tailwind base + un keyframe sutil para la llama (respeta `prefers-reduced-motion`).
- `src/pages/index.astro`: única página (hero + card de horarios + nota). Incluye el script que llama a Hebcal y actualiza la UI.
- `src/components/Candles.astro`: SVG hecho a mano de velitas cute/minimal (sin imágenes externas).
- `src/components/TimesCard.astro`: card con selector de ciudad + placeholders para los horarios.
- `src/lib/cities.ts`: ciudades disponibles (Buenos Aires / Jerusalem / New York) con coordenadas y TZ.
- `src/lib/hebcal.ts`: arma la URL de Hebcal y parsea la respuesta (candles + havdalah).
  
## Qué cumple de la consigna extra?
✅ Componentes reutilizables  
✅ Animaciones  
✅ Librerías CSS → usé Tailwind CSS  
✅ Fetch de API → para obtener los horarios de Shabbat  
✅ Deploy → con Vercel
