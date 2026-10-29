# Reto 101 apps

_By [Brian Hawkins](https://www.linkedin.com/in/briandh5/)_

Índice de las apps que voy construyendo, una por una, en el orden en que nacen.

**Avance:** 8 publicadas · 9 registradas · meta 101

| # | App | Qué hace | Stack | Código | En vivo | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | SQL en Bloques | Juego para aprender SQL armando consultas con piezas de arrastrar y soltar, con resultados y pistas en tiempo real. | React (Babel en el navegador) · Tailwind · motor SQL propio en JS · Vercel | [briandh5/learningSQL](https://github.com/briandh5/learningSQL) | [learningsql-zeta.vercel.app](https://learningsql-zeta.vercel.app/) | Publicada |
| 2 | SP Troop · Asistencia y Pre-nómina | Pase de lista diario por servicio y turno, y cierre de pre-nómina quincenal exportable a Excel para una empresa de seguridad privada. | Next.js 15 · TypeScript · Tailwind · ExcelJS · Vercel | [briandh5/sptroop-asistencia](https://github.com/briandh5/sptroop-asistencia) | [sptroop-asistencia.vercel.app](https://sptroop-asistencia.vercel.app/) | Publicada |
| 3 | Crecer | Acompañamiento del desarrollo infantil: crecimiento con curvas OMS, cartilla de vacunas, hitos por edad y diario con fotos. | Next.js 15 · TypeScript · Tailwind · Recharts · PostgreSQL (Supabase) · Vercel | [briandh5/crecer](https://github.com/briandh5/crecer) | [crecer-two.vercel.app](https://crecer-two.vercel.app) | Publicada |
| 4 | La Previa · Champions | Coordina con tus amigos dónde ver cada partido de la Champions: mapa ilustrado con pines y hashtags, calendario por fases, recordatorios, chat por evento y chat en vivo entre dispositivos. | Next.js 15 · TypeScript · Tailwind · SVG (d3-geo) · Supabase Realtime · Framer Motion · Lucide · Vercel | [briandh5/championsleague](https://github.com/briandh5/championsleague) | [championsleague-coral.vercel.app](https://championsleague-coral.vercel.app) | Publicada |
| 5 | Smart Pantry & Chef | Recetas estilo swipe con lo que ya tienes en la despensa, nutrición calculada por gramos, lista de compras inteligente con lo que falta y una interfaz que toma los colores de tus fotos. | React 19 · Vite · Tailwind · Framer Motion · Lucide · Vercel | [briandh5/smartPantry](https://github.com/briandh5/smartPantry) | [smartpantry-xi.vercel.app](https://smartpantry-xi.vercel.app/) | Publicada |
| 6 | Do you still remember? | Trivia retro estilo arcade de 8 bits con 7 categorías (ciencia, geografía, matemáticas, química, física, arte y bases de secundaria), cronómetro, calificación del 1 al 10, logros y tabla de High Scores. | React 19 · Vite · Tailwind · WebAudio · Vercel | [briandh5/doyouremember](https://github.com/briandh5/doyouremember) | [doyouremember-kappa.vercel.app](https://doyouremember-kappa.vercel.app/) | Publicada |
| 7 | Bosque de Niebla · Xalapa | Dashboard del microclima del bosque de niebla de Xalapa con datos reales (ERA5 y NASA POWER): mapa de calor de anomalías térmicas, lluvia vs. niebla, lluvias extremas y un modo aprendizaje que explica cada gráfica con Pandas y NumPy. Promueve al INECOL. | React 19 · Vite · Tailwind · Recharts · Vercel | [briandh5/bosquedeniebla](https://github.com/briandh5/bosquedeniebla) | [bosquedeniebla.vercel.app](https://bosquedeniebla.vercel.app/) | Publicada |
| 8 | Mira AR | Propuesta de realidad aumentada para el ecosistema de Google: señalas un edificio con la cámara y aparece su ficha estilo Maps para llegar, ver su sitio web, comprar boletos, reservar en restaurantes y cines o compartir fotos al instante. | React 19 · Vite · Tailwind · Vercel | [briandh5/arrealidad](https://github.com/briandh5/arrealidad) | [arrealidad.vercel.app](https://arrealidad.vercel.app/) | Publicada |
| 10 | Dark Theme DJ Mixer | Mezcladora DJ en el navegador con estética de hardware: dos decks con Play/Cue, jog y tempo, EQ, crossfader, buscador de canciones de Audius, sampler de 8 pads sintetizados (y con tus propios audios) y un fondo de luces neón que pulsa con el BPM detectado. | React 19 · Vite · Tailwind · Web Audio API · Audius API · Vercel | [briandh5/djmixer](https://github.com/briandh5/djmixer) | — | En construcción |

Las ideas con enlace en el nombre tienen su ficha completa en la carpeta [`ideas/`](ideas/).

---

## Sobre este repo

Es también una app (Next.js + Tailwind) que muestra este índice y tiene un botón **+** para registrar una idea nueva con un formulario que pide todos los detalles. Al guardar, la app hace un commit aquí mismo: agrega la idea a `data/ideas.json`, crea su ficha en `ideas/` y regenera este README.

### Ponerla en Vercel

1. En Vercel: **Add New → Project**, importa `briandh5/101greatideas` y pulsa **Deploy** (no hay que cambiar nada del build).
2. Crea un token de GitHub para que la app pueda guardar ideas:
   - https://github.com/settings/personal-access-tokens/new (token *fine-grained*).
   - **Repository access → Only select repositories →** `101greatideas`.
   - **Permissions → Repository permissions → Contents → Read and write**. Nada más.
3. En Vercel, **Settings → Environment Variables** (Production y Preview):

| Variable | Valor |
| --- | --- |
| `GITHUB_TOKEN` | el token del paso 2 |
| `CLAVE_EDICION` | una palabra secreta tuya; la app la pide antes de guardar para que nadie más agregue ideas |

4. **Deployments → ⋯ → Redeploy.**

Sin `GITHUB_TOKEN` la app funciona igual para ver el índice y llenar el formulario, pero al final te deja descargar la ficha en lugar de guardarla en GitHub.

### Correr en tu computadora

```bash
npm install
npm run dev        # http://localhost:3000
npm run readme     # regenera este README desde data/ideas.json
```
