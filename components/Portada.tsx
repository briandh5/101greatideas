"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LayoutGrid, Plus } from "lucide-react";
import Burbujas from "./Burbujas";
import SelectorIdioma from "./SelectorIdioma";
import Tap from "./Tap";
import { TEXTOS, type Idioma } from "@/lib/i18n";
import type { Idea } from "@/lib/types";

const ANCLA = "#todos";

type Vista = "intro" | "burbujas" | "todos";

/**
 * Portada de la guía en tres pasos: intro (título, texto y botón Iniciar), burbujas
 * que se disparan desde abajo, y la cuadrícula y lista de siempre (llega como children).
 * El listado vive en el ancla #todos para que "atrás" y recargar funcionen.
 */
export default function Portada({ ideas, idioma, children }: { ideas: Idea[]; idioma: Idioma; children: React.ReactNode }) {
  const t = TEXTOS[idioma];
  const [vista, setVista] = useState<Vista>("intro");
  const [saliendoIntro, setSaliendoIntro] = useState(false);
  const [explotando, setExplotando] = useState(false);
  // a dónde llevar al terminar la explosión: arriba del listado o a "Sobre la guía"
  const destino = useRef<"arriba" | "acerca">("arriba");
  // cambia en cada regreso para que las burbujas se vuelvan a disparar desde abajo
  const [tanda, setTanda] = useState(0);

  useEffect(() => {
    if (window.location.hash === ANCLA) setVista("todos");
    const leer = () => {
      setExplotando(false);
      if (window.location.hash === ANCLA) setVista("todos");
      else {
        setVista("burbujas");
        setTanda((n) => n + 1);
      }
    };
    window.addEventListener("popstate", leer);
    return () => window.removeEventListener("popstate", leer);
  }, []);

  const iniciar = () => {
    setSaliendoIntro(true);
    window.setTimeout(() => {
      setVista("burbujas");
      setSaliendoIntro(false);
    }, 320);
  };

  const verTodos = (a: "arriba" | "acerca" = "arriba") => {
    if (explotando) return;
    destino.current = a;
    setExplotando(true);
  };

  const alTerminarExplosion = () => {
    history.pushState(null, "", ANCLA);
    setExplotando(false);
    setVista("todos");
    window.scrollTo({ top: 0 });
    if (destino.current === "acerca") {
      window.setTimeout(
        () => document.getElementById("sobre-la-guia")?.closest("section")?.scrollIntoView({ behavior: "smooth", block: "center" }),
        120,
      );
    }
  };

  const volver = () => {
    history.pushState(null, "", window.location.pathname + window.location.search);
    window.scrollTo({ top: 0 });
    setTanda((n) => n + 1);
    setVista("burbujas");
  };

  return (
    <main>
      {vista === "intro" && (
        <section className={`grid min-h-[100svh] place-items-center px-6 py-16 text-center ${saliendoIntro ? "sale" : ""}`}>
          <div className="max-w-2xl">
            <h1 className="entra font-titulo text-6xl font-black leading-[0.95] tracking-tight sm:text-8xl">
              {t.titulo[0]}
              <br />
              {t.titulo[1]}
            </h1>
            <p
              className="entra mx-auto mt-8 max-w-xl font-firma text-lg font-light leading-relaxed text-tenue sm:text-xl"
              style={{ animationDelay: "700ms" }}
            >
              {t.introBurbujas}
            </p>
            <span className="relative mt-10 inline-block">
              <button
                type="button"
                onClick={iniciar}
                className="entra boton-primario px-10 py-4 text-base shadow-lg shadow-tomate/30"
                style={{ animationDelay: "1400ms" }}
              >
                {t.iniciar}
              </button>
              {/* el botón termina de aparecer a los ~2.1 s; la manita llega 3 s después */}
              <Tap retraso={5100} className="left-[62%] top-[60%]" />
            </span>
          </div>
          <SelectorIdioma
            idioma={idioma}
            className="entra fixed bottom-5 right-4 z-30 [animation-delay:1800ms] sm:bottom-6 sm:right-6"
          />
        </section>
      )}

      {vista === "burbujas" && (
        <Burbujas
          key={tanda}
          ideas={ideas}
          idioma={idioma}
          saliendo={explotando}
          onSalida={alTerminarExplosion}
          onRecargar={() => setTanda((n) => n + 1)}
        />
      )}

      {vista === "todos" && <div className="animate-[aparecer_300ms_ease-out]">{children}</div>}

      {vista === "burbujas" && (
        <div className="pointer-events-none fixed inset-x-0 bottom-3 z-30 flex flex-col items-center gap-1.5 px-4 animate-[aparecer_500ms_ease-out_both] sm:bottom-5">
          <button
            type="button"
            onClick={() => verTodos()}
            disabled={explotando}
            className="boton-primario pointer-events-auto whitespace-nowrap px-6 shadow-lg shadow-tomate/30"
          >
            <LayoutGrid size={17} /> {t.verTodos}
          </button>
          <button
            type="button"
            onClick={() => verTodos("acerca")}
            disabled={explotando}
            className="pointer-events-auto px-3 py-1 text-sm font-medium text-tinta underline decoration-1 underline-offset-4 transition hover:text-tomate"
          >
            {t.acercaDe}
          </button>
        </div>
      )}

      {vista === "todos" && (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-30 flex items-end justify-center gap-8 px-4 sm:bottom-8 sm:gap-14">
          <button
            type="button"
            onClick={volver}
            className="boton-primario pointer-events-auto whitespace-nowrap px-6 shadow-lg shadow-tomate/30"
          >
            <LayoutGrid size={17} /> {t.volverBurbujas}
          </button>
          <Link
            href="/nueva"
            className="pointer-events-auto flex flex-col items-center justify-center rounded-2xl bg-hoja px-4 py-2 text-tomate shadow-lg ring-2 ring-tomate transition hover:scale-105"
          >
            <Plus size={30} strokeWidth={2.75} />
            <span className="-mt-0.5 text-[11px] font-semibold leading-tight">{t.agregarIdea}</span>
          </Link>
        </div>
      )}
    </main>
  );
}
