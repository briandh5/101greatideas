"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Check, Settings } from "lucide-react";
import { COOKIE_IDIOMA, COOKIE_TEMA, TEXTOS, type Idioma, type Tema } from "@/lib/i18n";

const OPCIONES: { idioma: Idioma; nombre: string }[] = [
  { idioma: "es", nombre: "Español" },
  { idioma: "en", nombre: "English" },
];

/** Engrane fijo en la esquina con el idioma y el modo claro. Cada elección se guarda en una cookie por un año. */
export default function Ajustes({ idioma, tema: temaInicial }: { idioma: Idioma; tema: Tema }) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [tema, setTema] = useState(temaInicial);
  const [cambiando, startTransition] = useTransition();
  const caja = useRef<HTMLDivElement>(null);
  const t = TEXTOS[idioma];

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => !caja.current?.contains(e.target as Node) && setAbierto(false);
    const escape = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("pointerdown", fuera);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", fuera);
      document.removeEventListener("keydown", escape);
    };
  }, [abierto]);

  function elegir(nuevo: Idioma) {
    setAbierto(false);
    if (nuevo === idioma) return;
    document.cookie = `${COOKIE_IDIOMA}=${nuevo}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = nuevo;
    startTransition(() => router.refresh());
  }

  function cambiarTema() {
    const nuevo: Tema = tema === "claro" ? "oscuro" : "claro";
    setTema(nuevo);
    document.cookie = `${COOKIE_TEMA}=${nuevo}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.dataset.tema = nuevo;
  }

  return (
    <div ref={caja} className="fixed right-4 top-4 z-40 sm:right-6 sm:top-6">
      <button
        type="button"
        aria-label={t.ajustes}
        aria-expanded={abierto}
        onClick={() => setAbierto((a) => !a)}
        className="grid h-10 w-10 place-items-center rounded-full border border-linea bg-hoja/90 text-tenue shadow-sm backdrop-blur transition hover:text-tinta"
      >
        <Settings size={18} className={`transition-transform duration-500 ${abierto || cambiando ? "rotate-90" : ""}`} />
      </button>
      {abierto && (
        <div className="absolute right-0 mt-2 w-52 animate-[aparecer_160ms_ease-out] rounded-2xl border border-linea bg-hoja p-2 shadow-xl shadow-black/10">
          <p className="px-3 pb-1 pt-1.5 text-xs font-medium uppercase tracking-wide text-tenue">{t.idioma}</p>
          {OPCIONES.map((o) => (
            <button
              key={o.idioma}
              type="button"
              onClick={() => elegir(o.idioma)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-papel"
            >
              {o.nombre}
              {o.idioma === idioma && <Check size={16} className="text-tomate" />}
            </button>
          ))}
          <div className="mx-1 my-2 border-t border-linea" />
          <p className="px-3 pb-1 pt-0.5 text-xs font-medium uppercase tracking-wide text-tenue">{t.apariencia}</p>
          <button
            type="button"
            role="switch"
            aria-checked={tema === "claro"}
            onClick={cambiarTema}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-papel"
          >
            {t.modoClaro}
            <span
              className={`relative h-5 w-9 rounded-full transition-colors ${tema === "claro" ? "bg-tomate" : "bg-linea"}`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${tema === "claro" ? "left-[18px]" : "left-0.5"}`}
              />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
