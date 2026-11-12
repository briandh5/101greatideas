"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Check, ChevronUp, Languages } from "lucide-react";
import { COOKIE_IDIOMA, TEXTOS, type Idioma } from "@/lib/i18n";

const OPCIONES: { idioma: Idioma; nombre: string }[] = [
  { idioma: "en", nombre: "English" },
  { idioma: "es", nombre: "Español" },
];

/**
 * Botón pequeño de idioma para la pantalla de inicio (abajo a la derecha).
 * Muestra el idioma actual y despliega hacia arriba la otra opción. Guarda la misma
 * cookie que el engrane, así que ambos quedan sincronizados.
 */
export default function SelectorIdioma({ idioma, className = "" }: { idioma: Idioma; className?: string }) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [, startTransition] = useTransition();
  const caja = useRef<HTMLDivElement>(null);
  const actual = OPCIONES.find((o) => o.idioma === idioma)!;

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
    try {
      document.cookie = `${COOKIE_IDIOMA}=${nuevo}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      /* sin cookies, el cambio solo dura esta visita */
    }
    document.documentElement.lang = nuevo;
    window.dispatchEvent(new CustomEvent("101gi-idioma", { detail: nuevo }));
    startTransition(() => router.refresh());
  }

  return (
    <div className={className}>
      <div ref={caja} className="relative">
        {abierto && (
          <ul
            role="listbox"
            aria-label={TEXTOS[idioma].idioma}
            className="absolute bottom-full right-0 mb-2 w-36 animate-[aparecer_160ms_ease-out] rounded-2xl border border-linea bg-hoja p-1.5 shadow-xl shadow-black/20"
          >
            {OPCIONES.map((o) => (
              <li key={o.idioma}>
                <button
                  type="button"
                  role="option"
                  aria-selected={o.idioma === idioma}
                  onClick={() => elegir(o.idioma)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-papel"
                >
                  {o.nombre}
                  {o.idioma === idioma && <Check size={15} className="text-tomate" />}
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={() => setAbierto((a) => !a)}
          aria-expanded={abierto}
          aria-haspopup="listbox"
          className="inline-flex items-center gap-1.5 rounded-full border border-linea bg-hoja/80 px-3 py-1.5 text-xs font-medium text-tenue backdrop-blur transition hover:text-tinta"
        >
          <Languages size={14} /> {actual.nombre}
          <ChevronUp size={13} className={`transition-transform ${abierto ? "" : "rotate-180"}`} />
        </button>
      </div>
    </div>
  );
}
