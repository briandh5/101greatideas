"use client";

import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { COLOR_ESTADO, EtiquetaEstado } from "./Estado";
import type { Idea } from "@/lib/types";

const COLUMNAS = 20;

/** Lleva la vista a la tarjeta del proyecto y la resalta unos segundos. */
export function irAProyecto(numero: number) {
  const tarjeta = document.getElementById(`idea-${numero}`);
  if (!tarjeta) return;
  tarjeta.scrollIntoView({ behavior: "smooth", block: "center" });
  tarjeta.classList.remove("resaltada");
  void tarjeta.offsetWidth; // reinicia la animación si se toca dos veces
  tarjeta.classList.add("resaltada");
  window.setTimeout(() => tarjeta.classList.remove("resaltada"), 2600);
}

export default function Tablero({ ideas, meta }: { ideas: Idea[]; meta: number }) {
  const [conMouse, setConMouse] = useState(false);
  const [activa, setActiva] = useState<number | null>(null);
  const casillas = Array.from({ length: Math.max(meta, ideas.length) }, (_, n) => ideas.find((i) => i.numero === n + 1));

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setConMouse(mq.matches);
    const cambio = (e: MediaQueryListEvent) => setConMouse(e.matches);
    mq.addEventListener("change", cambio);
    return () => mq.removeEventListener("change", cambio);
  }, []);

  return (
    <div className="mt-5 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1 sm:gap-1.5">
      {casillas.map((idea, n) => {
        if (!idea) return <span key={n} aria-hidden className="aspect-square rounded-[3px] bg-linea/70" />;
        const columna = n % COLUMNAS;
        const fila = Math.floor(n / COLUMNAS);
        const abierta = conMouse && activa === idea.numero;
        return (
          <div
            key={n}
            className="relative"
            onMouseEnter={() => conMouse && setActiva(idea.numero)}
            onMouseLeave={() => conMouse && setActiva(null)}
          >
            <button
              type="button"
              aria-label={`#${idea.numero} ${idea.nombre}, ${idea.estado}. Ir al proyecto`}
              onClick={() => {
                setActiva(null);
                irAProyecto(idea.numero);
              }}
              onFocus={() => conMouse && setActiva(idea.numero)}
              onBlur={() => setActiva(null)}
              className={`casilla block aspect-square w-full rounded-[3px] ${COLOR_ESTADO[idea.estado]} ${abierta ? "encendida" : ""}`}
              style={{ ["--brillo" as string]: `var(--brillo-${idea.estado === "Publicada" ? "menta" : idea.estado === "Idea" ? "mostaza" : "tomate"})` }}
            />
            {abierta && <Vista idea={idea} columna={columna} abajo={fila === 0} />}
          </div>
        );
      })}
    </div>
  );
}

/** Tarjeta flotante con datos y una vista previa en vivo del proyecto. */
function Vista({ idea, columna, abajo }: { idea: Idea; columna: number; abajo: boolean }) {
  const [cargada, setCargada] = useState(false);
  const lado = columna < 6 ? "left-0" : columna > 13 ? "right-0" : "left-1/2 -translate-x-1/2";
  return (
    <div
      className={`pointer-events-none absolute z-30 w-80 ${lado} ${abajo ? "top-full mt-3" : "bottom-full mb-3"}`}
    >
      <div className="animate-[aparecer_160ms_ease-out] overflow-hidden rounded-2xl border border-linea bg-hoja shadow-2xl shadow-black/20">
        {idea.enVivo ? (
          <div className="relative h-[200px] w-80 overflow-hidden border-b border-linea bg-papel">
            {!cargada && (
              <span className="absolute inset-0 grid place-items-center text-xs text-tenue">Cargando vista previa…</span>
            )}
            <iframe
              src={idea.enVivo}
              title={`Vista previa de ${idea.nombre}`}
              loading="lazy"
              tabIndex={-1}
              onLoad={() => setCargada(true)}
              className={`h-[800px] w-[1280px] origin-top-left scale-[0.25] border-0 transition-opacity ${cargada ? "opacity-100" : "opacity-0"}`}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ) : (
          <div className="grid h-24 place-items-center border-b border-linea bg-papel text-xs text-tenue">Aún sin versión en vivo</div>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="font-titulo text-lg font-bold leading-tight">
              <span className="text-tomate">#{idea.numero}</span> {idea.nombre}
            </p>
            <EtiquetaEstado estado={idea.estado} />
          </div>
          <p className="mt-2 line-clamp-3 text-sm text-tenue">{idea.resumen}</p>
          <p className="mt-2 text-xs text-tenue">{idea.stack}</p>
          <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-tomate">
            <ArrowDown size={13} /> Clic para ver el proyecto completo
          </p>
        </div>
      </div>
    </div>
  );
}
