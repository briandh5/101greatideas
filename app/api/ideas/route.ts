import { NextResponse } from "next/server";
import { BORRADOR_VACIO, TODOS_LOS_CAMPOS, validar, type Borrador } from "@/lib/formulario";
import { commit, leerIdeas, puedeGuardar } from "@/lib/github";
import { borradorAIdea, siguienteNumero } from "@/lib/ideas";
import { archivoDeIdea, generarFicha, generarReadme } from "@/lib/markdown";
import { ESTADOS, type Estado, type Idea } from "@/lib/types";

export const dynamic = "force-dynamic";

function sitio(req: Request): string {
  return new URL(req.url).origin;
}

function claveIncorrecta(clave: unknown): boolean {
  const esperada = process.env.CLAVE_EDICION;
  return Boolean(esperada) && clave !== esperada;
}

function archivosDelIndice(ideas: Idea[], req: Request, extra: Record<string, string> = {}) {
  return {
    "data/ideas.json": JSON.stringify(ideas, null, 2) + "\n",
    "README.md": generarReadme(ideas, sitio(req)),
    ...extra,
  };
}

function errorDeGitHub(e: unknown) {
  console.error(e);
  const status = (e as { status?: number }).status;
  const mensaje =
    status === 401 || status === 403 || status === 404
      ? "GitHub rechazó el token. Revisa que GITHUB_TOKEN tenga permiso Contents: Read and write sobre 101greatideas."
      : status === 422 || status === 409
        ? "Alguien guardó al mismo tiempo. Intenta de nuevo."
        : "No se pudo guardar en GitHub. Intenta de nuevo en un momento.";
  return NextResponse.json({ error: mensaje }, { status: 502 });
}

export async function GET() {
  return NextResponse.json({
    ideas: await leerIdeas(),
    puedeGuardar: puedeGuardar(),
    pideClave: Boolean(process.env.CLAVE_EDICION),
  });
}

/** Registra una idea nueva: la agrega al índice, crea su ficha y regenera el README, en un solo commit. */
export async function POST(req: Request) {
  if (!puedeGuardar()) return NextResponse.json({ error: "Falta configurar GITHUB_TOKEN en Vercel." }, { status: 503 });
  const cuerpo = (await req.json().catch(() => null)) as { clave?: string; borrador?: Borrador } | null;
  if (!cuerpo?.borrador) return NextResponse.json({ error: "No llegó la idea." }, { status: 400 });
  if (claveIncorrecta(cuerpo.clave)) return NextResponse.json({ error: "La clave no es correcta." }, { status: 401 });

  const borrador = { ...BORRADOR_VACIO, ...cuerpo.borrador };
  const errores = validar(borrador, TODOS_LOS_CAMPOS);
  if (Object.keys(errores).length) return NextResponse.json({ error: "Faltan datos.", errores }, { status: 422 });

  try {
    const ideas = await leerIdeas();
    const idea = borradorAIdea(borrador, siguienteNumero(ideas));
    const nuevas = [...ideas, idea];
    await commit(
      archivosDelIndice(nuevas, req, { [archivoDeIdea(idea)]: generarFicha(idea) }),
      `Idea #${idea.numero}: ${idea.nombre}`,
    );
    return NextResponse.json({ idea });
  } catch (e) {
    return errorDeGitHub(e);
  }
}

/** Actualiza estado, repo o enlace en vivo de una idea existente. */
export async function PATCH(req: Request) {
  if (!puedeGuardar()) return NextResponse.json({ error: "Falta configurar GITHUB_TOKEN en Vercel." }, { status: 503 });
  const cuerpo = (await req.json().catch(() => null)) as {
    clave?: string;
    numero?: number;
    estado?: Estado;
    repo?: string;
    enVivo?: string;
  } | null;
  if (!cuerpo?.numero) return NextResponse.json({ error: "Falta el número de idea." }, { status: 400 });
  if (claveIncorrecta(cuerpo.clave)) return NextResponse.json({ error: "La clave no es correcta." }, { status: 401 });
  if (cuerpo.estado && !ESTADOS.includes(cuerpo.estado)) return NextResponse.json({ error: "Estado no válido." }, { status: 400 });
  for (const url of [cuerpo.repo, cuerpo.enVivo]) {
    if (url && !/^https?:\/\/\S+\.\S+/.test(url)) return NextResponse.json({ error: "Los enlaces deben empezar con https://" }, { status: 400 });
  }

  try {
    const ideas = await leerIdeas();
    const actual = ideas.find((i) => i.numero === cuerpo.numero);
    if (!actual) return NextResponse.json({ error: "No existe esa idea." }, { status: 404 });
    const idea: Idea = {
      ...actual,
      estado: cuerpo.estado ?? actual.estado,
      repo: cuerpo.repo !== undefined ? cuerpo.repo.trim() : actual.repo,
      enVivo: cuerpo.enVivo !== undefined ? cuerpo.enVivo.trim() : actual.enVivo,
    };
    const nuevas = ideas.map((i) => (i.numero === idea.numero ? idea : i));
    const extra = idea.detalle ? { [archivoDeIdea(idea)]: generarFicha(idea) } : {};
    await commit(archivosDelIndice(nuevas, req, extra), `Idea #${idea.numero}: ${idea.estado}`);
    return NextResponse.json({ idea });
  } catch (e) {
    return errorDeGitHub(e);
  }
}
