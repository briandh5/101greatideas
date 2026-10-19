import type { Borrador } from "./formulario";
import type { Idea } from "./types";

export function hoy(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Mexico_City" });
}

export function borradorAIdea(b: Borrador, numero: number): Idea {
  const { nombre, resumen, estado, stack, repo, enVivo, ...detalle } = b;
  const limpio = (t: string) => t.trim();
  return {
    numero,
    nombre: limpio(nombre),
    resumen: limpio(resumen),
    stack: limpio(stack),
    repo: limpio(repo),
    enVivo: limpio(enVivo),
    estado,
    creada: hoy(),
    detalle: {
      ...detalle,
      funcionalidades: detalle.funcionalidades.map(limpio).filter(Boolean),
      pantallas: detalle.pantallas
        .map((p) => ({ nombre: limpio(p.nombre), descripcion: limpio(p.descripcion) }))
        .filter((p) => p.nombre && p.descripcion),
    },
  };
}

export function siguienteNumero(ideas: Idea[]): number {
  return ideas.reduce((max, i) => Math.max(max, i.numero), 0) + 1;
}
