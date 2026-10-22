import { nombreEstado, type Idioma } from "@/lib/i18n";
import type { Estado } from "@/lib/types";

export const COLOR_ESTADO: Record<Estado, string> = {
  Idea: "bg-mostaza",
  "En construcción": "bg-tomate",
  Publicada: "bg-menta",
  "En pausa": "bg-tenue",
};

export function EtiquetaEstado({ estado, idioma = "es" }: { estado: Estado; idioma?: Idioma }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-linea bg-papel px-2.5 py-1 text-xs font-medium text-tinta">
      <span className={`h-2 w-2 rounded-full ${COLOR_ESTADO[estado]}`} />
      {nombreEstado(estado, idioma)}
    </span>
  );
}
