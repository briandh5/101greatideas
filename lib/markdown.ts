import type { Detalle, Idea } from "./types";

export const META = 100;

export function slug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export function archivoDeIdea(idea: Pick<Idea, "numero" | "nombre">): string {
  return `ideas/${String(idea.numero).padStart(3, "0")}-${slug(idea.nombre)}.md`;
}

function celda(texto: string): string {
  return texto.replace(/\|/g, "\\|").replace(/\n+/g, " ");
}

function enlace(url: string): string {
  if (!url) return "—";
  const visible = url.replace(/^https?:\/\/(www\.)?/, "").replace(/^github\.com\//, "").replace(/\/$/, "");
  return `[${visible}](${url})`;
}

/** README del repo: el índice que se ve en GitHub. Se regenera cada vez que se guarda una idea. */
export function generarReadme(ideas: Idea[], sitio?: string): string {
  const publicadas = ideas.filter((i) => i.estado === "Publicada").length;
  const filas = ideas
    .map((i) => {
      const nombre = i.detalle ? `[${celda(i.nombre)}](${archivoDeIdea(i)})` : celda(i.nombre);
      return `| ${i.numero} | ${nombre} | ${celda(i.resumen)} | ${celda(i.stack)} | ${enlace(i.repo)} | ${enlace(i.enVivo)} | ${i.estado} |`;
    })
    .join("\n");

  return `# 101 great ideas · Reto 100 apps

Índice de las apps que voy construyendo, una por una, en el orden en que nacen.

**Avance:** ${publicadas} publicadas · ${ideas.length} registradas · meta ${META}
${sitio ? `\n**Ver y agregar ideas:** ${sitio}\n` : ""}
| # | App | Qué hace | Stack | Código | En vivo | Estado |
| --- | --- | --- | --- | --- | --- | --- |
${filas}

Las ideas con enlace en el nombre tienen su ficha completa en la carpeta [\`ideas/\`](ideas/).

---

## Sobre este repo

Es también una app (Next.js + Tailwind) que muestra este índice y tiene un botón **+** para registrar una idea nueva con un formulario que pide todos los detalles. Al guardar, la app hace un commit aquí mismo: agrega la idea a \`data/ideas.json\`, crea su ficha en \`ideas/\` y regenera este README.

### Ponerla en Vercel

1. En Vercel: **Add New → Project**, importa \`briandh5/101greatideas\` y pulsa **Deploy** (no hay que cambiar nada del build).
2. Crea un token de GitHub para que la app pueda guardar ideas:
   - https://github.com/settings/personal-access-tokens/new (token *fine-grained*).
   - **Repository access → Only select repositories →** \`101greatideas\`.
   - **Permissions → Repository permissions → Contents → Read and write**. Nada más.
3. En Vercel, **Settings → Environment Variables** (Production y Preview):

| Variable | Valor |
| --- | --- |
| \`GITHUB_TOKEN\` | el token del paso 2 |
| \`CLAVE_EDICION\` | una palabra secreta tuya; la app la pide antes de guardar para que nadie más agregue ideas |

4. **Deployments → ⋯ → Redeploy.**

Sin \`GITHUB_TOKEN\` la app funciona igual para ver el índice y llenar el formulario, pero al final te deja descargar la ficha en lugar de guardarla en GitHub.

### Correr en tu computadora

\`\`\`bash
npm install
npm run dev        # http://localhost:3000
npm run readme     # regenera este README desde data/ideas.json
\`\`\`
`;
}

function lista(items: string[]): string {
  return items.filter(Boolean).map((t) => `- ${t}`).join("\n");
}

/** Ficha completa de una idea. También sirve como brief para pedirle a Claude que la construya. */
export function generarFicha(idea: Idea): string {
  const d = idea.detalle as Detalle;
  const pantallas = d.pantallas.map((p) => `- **${p.nombre}:** ${p.descripcion}`).join("\n");
  return `# #${idea.numero} · ${idea.nombre}

> ${idea.resumen}

| | |
| --- | --- |
| Estado | ${idea.estado} |
| Categoría | ${d.categoria} |
| Registrada | ${idea.creada} |
| Fecha objetivo | ${d.fechaObjetivo || "—"} |
| Stack | ${idea.stack} |
| Código | ${enlace(idea.repo)} |
| En vivo | ${enlace(idea.enVivo)} |

## El problema

**Qué problema resuelve:** ${d.problema}

**Para quién:** ${d.usuarios}

**Cómo lo resuelven hoy:** ${d.alternativas}

**Por qué esta app es mejor:** ${d.diferenciador}

## Qué hace (MVP)

${lista(d.funcionalidades)}

### Pantallas

${pantallas}

### Flujo principal

${d.flujo}

### Fuera del MVP

${d.fueraDeAlcance}

## Datos y cuentas

**Qué datos guarda:** ${d.datos}

**Cuentas de usuario:** ${d.cuentas}

**Roles:** ${d.roles}

**Dónde se guardan los datos:** ${d.almacenamiento}

**Integraciones y APIs externas:** ${d.integraciones}

**Exportaciones:** ${d.exportaciones}

**Notificaciones:** ${d.notificaciones}

## Diseño

**Estilo visual:** ${d.estilo}

**Colores:** primario \`${d.colores.primario}\` · secundario \`${d.colores.secundario}\` · fondo \`${d.colores.fondo}\`

**Tipografía:** ${d.tipografia || "a elección"}

**Referencias:** ${d.referencias}

**Idioma:** ${d.idioma} · **Dispositivo principal:** ${d.dispositivo} · **Modo oscuro:** ${d.modoOscuro}

**Logo e imágenes disponibles:** ${d.recursos || "ninguno todavía"}

## Éxito y restricciones

**Cómo sabré que funciona:** ${d.metricaExito}

**Restricciones (presupuesto, legal, privacidad, tiempo):** ${d.restricciones}
${d.notas ? `\n## Notas\n\n${d.notas}\n` : ""}
---

## Prompt para construirla

Construye la app #${idea.numero} de mi reto de 100 apps, "${idea.nombre}", siguiendo esta ficha al pie de la letra. Stack: ${idea.stack}. Toda la interfaz en ${d.idioma.toLowerCase()}. Empieza por el MVP descrito arriba, respeta las pantallas, el flujo principal, los datos y el diseño indicados, y deja fuera lo marcado como "Fuera del MVP". Al terminar, súbela a GitHub con un README en español que explique cómo ponerla en Vercel.
`;
}
