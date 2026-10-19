import "server-only";
import ideasIncluidas from "@/data/ideas.json";
import type { Idea } from "./types";

const REPO = process.env.GITHUB_REPO || "briandh5/101greatideas";
const RAMA = process.env.GITHUB_BRANCH || "main";
const API = `${process.env.GITHUB_API_URL || "https://api.github.com"}/repos/${REPO}`;

export const puedeGuardar = () => Boolean(process.env.GITHUB_TOKEN);

async function gh<T>(ruta: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${ruta}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!res.ok) {
    const texto = await res.text();
    const error = new Error(`GitHub respondió ${res.status} en ${ruta}: ${texto.slice(0, 300)}`) as Error & {
      status?: number;
    };
    error.status = res.status;
    throw error;
  }
  return res.json() as Promise<T>;
}

/**
 * Lee el índice. Con token, lo trae directo de GitHub para que una idea recién
 * guardada aparezca sin esperar a que Vercel vuelva a desplegar.
 */
export async function leerIdeas(): Promise<Idea[]> {
  if (!puedeGuardar()) return ideasIncluidas as Idea[];
  try {
    const archivo = await gh<{ content: string }>(`/contents/data/ideas.json?ref=${RAMA}`);
    return JSON.parse(Buffer.from(archivo.content, "base64").toString("utf8")) as Idea[];
  } catch (e) {
    console.error(e);
    return ideasIncluidas as Idea[];
  }
}

/** Escribe varios archivos en un solo commit sobre la rama principal. */
export async function commit(archivos: Record<string, string>, mensaje: string): Promise<void> {
  const ref = await gh<{ object: { sha: string } }>(`/git/ref/heads/${RAMA}`);
  const padre = await gh<{ tree: { sha: string } }>(`/git/commits/${ref.object.sha}`);
  const arbol = await gh<{ sha: string }>(`/git/trees`, {
    method: "POST",
    body: JSON.stringify({
      base_tree: padre.tree.sha,
      tree: Object.entries(archivos).map(([path, content]) => ({ path, mode: "100644", type: "blob", content })),
    }),
  });
  const nuevo = await gh<{ sha: string }>(`/git/commits`, {
    method: "POST",
    body: JSON.stringify({ message: mensaje, tree: arbol.sha, parents: [ref.object.sha] }),
  });
  await gh(`/git/refs/heads/${RAMA}`, { method: "PATCH", body: JSON.stringify({ sha: nuevo.sha, force: false }) });
}
