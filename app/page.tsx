import Link from "next/link";
import { ArrowUpRight, Github, Plus } from "lucide-react";
import { COLOR_ESTADO, EtiquetaEstado } from "@/components/Estado";
import { leerIdeas } from "@/lib/github";
import { META } from "@/lib/markdown";
import { ESTADOS } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Inicio() {
  const ideas = await leerIdeas();
  const publicadas = ideas.filter((i) => i.estado === "Publicada").length;
  const casillas = Array.from({ length: Math.max(META, ideas.length) }, (_, n) => ideas.find((i) => i.numero === n + 1));

  return (
    <main className="mx-auto max-w-5xl px-4 pb-32 pt-10 sm:px-6 sm:pt-16">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-tomate">Reto 100 apps</p>
          <h1 className="mt-2 font-titulo text-5xl font-black leading-none tracking-tight sm:text-7xl">
            101 great
            <br />
            ideas
          </h1>
        </div>
        <Link href="/nueva" className="boton-primario hidden sm:inline-flex">
          <Plus size={18} /> Nueva idea
        </Link>
      </header>

      <section className="mt-10 rounded-3xl border border-linea bg-hoja p-5 sm:p-7">
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
          <p className="font-titulo text-4xl font-bold">
            {publicadas}
            <span className="text-tenue"> / {META}</span>
          </p>
          <p className="text-sm text-tenue">
            {publicadas} publicadas · {ideas.length} registradas
          </p>
        </div>
        <div className="mt-5 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1 sm:gap-1.5" aria-hidden>
          {casillas.map((idea, n) => (
            <span
              key={n}
              title={idea ? `#${idea.numero} ${idea.nombre}` : `#${n + 1}`}
              className={`aspect-square rounded-[3px] ${idea ? COLOR_ESTADO[idea.estado] : "bg-linea/70"}`}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-tenue">
          {ESTADOS.map((e) => (
            <span key={e} className="inline-flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-sm ${COLOR_ESTADO[e]}`} /> {e}
            </span>
          ))}
        </div>
      </section>

      <ol className="mt-10 grid gap-4">
        {[...ideas].reverse().map((idea) => (
          <li key={idea.numero}>
            <article className="group relative grid grid-cols-[auto,1fr] gap-x-5 rounded-3xl border border-linea bg-hoja p-5 transition hover:border-tinta/30 sm:gap-x-7 sm:p-6">
              <span className="font-titulo text-5xl font-black leading-none text-tomate/90 sm:text-6xl">
                {String(idea.numero).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-titulo text-2xl font-bold leading-tight">
                    <Link href={`/idea/${idea.numero}`} className="after:absolute after:inset-0">
                      {idea.nombre}
                    </Link>
                  </h2>
                  <EtiquetaEstado estado={idea.estado} />
                </div>
                <p className="mt-2 text-tenue">{idea.resumen}</p>
                <p className="mt-3 text-xs text-tenue">{idea.stack}</p>
                {(idea.repo || idea.enVivo) && (
                  <div className="relative z-10 mt-4 flex flex-wrap gap-2">
                    {idea.enVivo && (
                      <a href={idea.enVivo} target="_blank" rel="noreferrer" className="boton-secundario px-4 py-2">
                        Abrir <ArrowUpRight size={15} />
                      </a>
                    )}
                    {idea.repo && (
                      <a href={idea.repo} target="_blank" rel="noreferrer" className="boton-secundario px-4 py-2">
                        <Github size={15} /> Código
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          </li>
        ))}
      </ol>

      <Link
        href="/nueva"
        aria-label="Nueva idea"
        className="fixed bottom-6 right-6 grid h-16 w-16 place-items-center rounded-full bg-tomate text-white shadow-lg shadow-tomate/30 transition hover:scale-105 sm:bottom-8 sm:right-8"
      >
        <Plus size={30} strokeWidth={2.5} />
      </Link>
    </main>
  );
}
