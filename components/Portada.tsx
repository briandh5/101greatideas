"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, Plus } from "lucide-react";
import Burbujas from "./Burbujas";
import { TEXTOS, type Idioma } from "@/lib/i18n";
import type { Idea } from "@/lib/types";

const ANCLA = "#todos";

/**
 * Portada de la guía: primero las burbujas; el botón fijo de abajo cambia a la
 * cuadrícula y lista de siempre (que llega ya renderizada como children).
 * La vista vive en el ancla #todos para que "atrás" y recargar funcionen.
 */
export default function Portada({ ideas, idioma, children }: { ideas: Idea[]; idioma: Idioma; children: React.ReactNode }) {
  const t = TEXTOS[idioma];
  const [todos, setTodos] = useState(false);

  useEffect(() => {
    const leer = () => setTodos(window.location.hash === ANCLA);
    leer();
    window.addEventListener("popstate", leer);
    return () => window.removeEventListener("popstate", leer);
  }, []);

  const cambiar = () => {
    const siguiente = !todos;
    history.pushState(null, "", siguiente ? ANCLA : window.location.pathname + window.location.search);
    setTodos(siguiente);
    window.scrollTo({ top: 0 });
  };

  return (
    <main>
      {todos ? <div className="animate-[aparecer_220ms_ease-out]">{children}</div> : <Burbujas ideas={ideas} idioma={idioma} />}

      <button
        type="button"
        onClick={cambiar}
        className="boton-primario fixed bottom-6 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap px-6 shadow-lg shadow-tomate/30 sm:bottom-8"
      >
        <LayoutGrid size={17} /> {todos ? t.volverBurbujas : t.verTodos}
      </button>

      {todos && (
        <Link
          href="/nueva"
          aria-label={t.nuevaIdea}
          className="fixed bottom-6 right-4 grid h-14 w-14 place-items-center rounded-full bg-tomate text-white shadow-lg shadow-tomate/30 transition hover:scale-105 sm:bottom-8 sm:right-8 sm:h-16 sm:w-16"
        >
          <Plus size={28} strokeWidth={2.5} />
        </Link>
      )}
    </main>
  );
}
