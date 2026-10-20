# Reto 101 apps

_By [Brian Hawkins](https://www.linkedin.com/in/briandh5/)_

Índice de las apps que voy construyendo, una por una, en el orden en que nacen.

**Avance:** 3 publicadas · 4 registradas · meta 101

| # | App | Qué hace | Stack | Código | En vivo | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | SQL en Bloques | Juego para aprender SQL armando consultas con piezas de arrastrar y soltar, con resultados y pistas en tiempo real. | React (Babel en el navegador) · Tailwind · motor SQL propio en JS · Vercel | [briandh5/learningSQL](https://github.com/briandh5/learningSQL) | [learningsql-zeta.vercel.app](https://learningsql-zeta.vercel.app/) | Publicada |
| 2 | SP Troop · Asistencia y Pre-nómina | Pase de lista diario por servicio y turno, y cierre de pre-nómina quincenal exportable a Excel para una empresa de seguridad privada. | Next.js 15 · TypeScript · Tailwind · ExcelJS · Vercel | [briandh5/sptroop-asistencia](https://github.com/briandh5/sptroop-asistencia) | [sptroop-asistencia.vercel.app](https://sptroop-asistencia.vercel.app/) | Publicada |
| 3 | Crecer | Acompañamiento del desarrollo infantil: crecimiento con curvas OMS, cartilla de vacunas, hitos por edad y diario con fotos. | Next.js 15 · TypeScript · Tailwind · Recharts · PostgreSQL (Supabase) · Vercel | [briandh5/crecer](https://github.com/briandh5/crecer) | [crecer-two.vercel.app](https://crecer-two.vercel.app) | Publicada |
| 4 | La Previa · Champions | Coordina con tus amigos dónde ver cada partido de la Champions: mapa ilustrado con pines y hashtags, calendario por fases, recordatorios y chat por evento. | Next.js 15 · TypeScript · Tailwind · Leaflet · Framer Motion · Lucide · Vercel | — | — | En construcción |

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
