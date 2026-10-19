import Link from "next/link";
import { ArrowUpRight, FileText, Github, Linkedin, Plus } from "lucide-react";
import Tablero from "@/components/Tablero";
import { COLOR_ESTADO, EtiquetaEstado } from "@/components/Estado";
import { leerIdeas } from "@/lib/github";
import { META } from "@/lib/markdown";
import { ESTADOS } from "@/lib/types";

export const dynamic = "force-dynamic";

const LINKEDIN = "https://www.linkedin.com/in/briandh5/";

export default async function Inicio() {
  const ideas = await leerIdeas();
  const publicadas = ideas.filter((i) => i.estado === "Publicada").length;

  return (
    <main className="mx-auto max-w-5xl px-4 pb-32 pt-10 sm:px-6 sm:pt-16">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-titulo text-6xl font-black leading-[0.95] tracking-tight sm:text-8xl">
            Reto
            <br />
            101 apps
          </h1>
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block font-firma text-lg font-light tracking-wide text-tenue transition hover:text-tomate sm:text-xl"
          >
            By <span className="font-medium text-tinta">Brian Hawkins</span>
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={LINKEDIN} target="_blank" rel="noreferrer" className="boton-secundario">
            <Linkedin size={17} /> Contact me
          </a>
          <Link href="/nueva" className="boton-primario hidden sm:inline-flex">
            <Plus size={18} /> Nueva idea
          </Link>
        </div>
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
        <Tablero ideas={ideas} meta={META} />
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
            <article
              id={`idea-${idea.numero}`}
              className="group relative grid scroll-mt-24 grid-cols-[auto,1fr] gap-x-5 rounded-3xl border border-linea bg-hoja p-5 transition hover:border-tinta/30 sm:gap-x-7 sm:p-6">
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
                    <Link href={`/idea/${idea.numero}`} className="boton-secundario px-4 py-2">
                      <FileText size={15} /> Ficha completa
                    </Link>
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
