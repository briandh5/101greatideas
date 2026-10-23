"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Presentation, X } from "lucide-react";
import { TEXTOS, type Idioma } from "@/lib/i18n";

/** Botón que abre las slides de una app en una ventana emergente, una imagen por slide. */
export default function Presentacion({
  slides,
  titulo,
  idioma,
  className = "boton-secundario px-4 py-2",
}: {
  slides: string[];
  titulo: string;
  idioma: Idioma;
  className?: string;
}) {
  const t = TEXTOS[idioma];
  const dialogo = useRef<HTMLDialogElement>(null);
  const [actual, setActual] = useState(0);
  const total = slides.length;

  const ir = useCallback((paso: number) => setActual((a) => Math.min(total - 1, Math.max(0, a + paso))), [total]);

  const abrir = () => {
    setActual(0);
    dialogo.current?.showModal();
    document.body.style.overflow = "hidden";
  };

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    const teclas = (e: KeyboardEvent) => {
      if (!d.open) return;
      if (e.key === "ArrowRight") ir(1);
      if (e.key === "ArrowLeft") ir(-1);
    };
    const bloquear = () => (document.body.style.overflow = "");
    document.addEventListener("keydown", teclas);
    d.addEventListener("close", bloquear);
    return () => {
      document.removeEventListener("keydown", teclas);
      d.removeEventListener("close", bloquear);
    };
  }, [ir]);

  // Precarga la siguiente slide para que el cambio sea inmediato
  useEffect(() => {
    if (actual + 1 < total) new Image().src = slides[actual + 1];
  }, [actual, slides, total]);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={abrir}
      >
        <Presentation size={15} /> {t.verPresentacion}
      </button>
      <dialog
        ref={dialogo}
        aria-label={`${t.presentacion}: ${titulo}`}
        onClick={(e) => e.target === dialogo.current && dialogo.current?.close()}
        onContextMenu={(e) => e.preventDefault()}
        className="m-auto w-[min(1200px,calc(100vw-24px))] max-w-none rounded-3xl border border-linea bg-hoja p-0 text-tinta backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-3 border-b border-linea px-4 py-3 sm:px-5">
          <p className="min-w-0 truncate font-titulo text-lg font-bold">{titulo}</p>
          <div className="flex shrink-0 items-center gap-3">
            <span className="text-sm tabular-nums text-tenue">
              {actual + 1} / {total}
            </span>
            <button
              type="button"
              onClick={() => dialogo.current?.close()}
              aria-label={t.cerrar}
              className="grid h-9 w-9 place-items-center rounded-full border border-linea hover:border-tinta/40"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="relative bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slides[actual]}
            alt={`${titulo}, slide ${actual + 1} ${t.de} ${total}`}
            draggable={false}
            className="block aspect-video w-full select-none object-contain"
          />
          <button
            type="button"
            onClick={() => ir(-1)}
            disabled={actual === 0}
            aria-label={t.anterior}
            className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white transition hover:bg-black/75 disabled:opacity-0"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={() => ir(1)}
            disabled={actual === total - 1}
            aria-label={t.siguiente}
            className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white transition hover:bg-black/75 disabled:opacity-0"
          >
            <ChevronRight size={22} />
          </button>
        </div>
        <div className="flex justify-center gap-1.5 px-4 py-3">
          {slides.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => setActual(i)}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === actual}
              className={`h-2 rounded-full transition-all ${i === actual ? "w-6 bg-tomate" : "w-2 bg-linea hover:bg-tenue"}`}
            />
          ))}
        </div>
      </dialog>
    </>
  );
}
