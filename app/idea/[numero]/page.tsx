import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { BotonCopiar } from "@/components/Asistente";
import EditarIdea from "@/components/EditarIdea";
import { EtiquetaEstado } from "@/components/Estado";
import { PASOS, type Borrador } from "@/lib/formulario";
import { leerIdeas, puedeGuardar } from "@/lib/github";
import { resumenDe, stackDe, TEXTOS } from "@/lib/i18n";
import { leerIdioma } from "@/lib/idioma";
import { generarFicha } from "@/lib/markdown";

export const dynamic = "force-dynamic";

const OMITIR = new Set(["nombre", "resumen", "estado", "stack", "repo", "enVivo"]);

export default async function FichaIdea({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  const idea = (await leerIdeas()).find((i) => i.numero === Number(numero));
  if (!idea) notFound();
  const idioma = await leerIdioma();
  const t = TEXTOS[idioma];
  const b = idea.detalle ? ({ ...idea, ...idea.detalle } as Borrador) : null;

  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-tenue hover:text-tinta">
        <ArrowLeft size={15} /> {t.indice}
      </Link>

      <header className="mt-8">
        <p className="font-titulo text-6xl font-black leading-none text-tomate">{String(idea.numero).padStart(2, "0")}</p>
        <h1 className="mt-3 font-titulo text-4xl font-bold leading-tight sm:text-5xl">{idea.nombre}</h1>
        <p className="mt-3 text-lg text-tenue">{resumenDe(idea, idioma)}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <EtiquetaEstado estado={idea.estado} idioma={idioma} />
          {idea.detalle && (
            <span className="rounded-full border border-linea bg-papel px-2.5 py-1 text-xs">{idea.detalle.categoria}</span>
          )}
          <span className="text-xs text-tenue">{t.registradaEl} {idea.creada}</span>
        </div>
        <p className="mt-4 text-sm text-tenue">{stackDe(idea, idioma)}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {idea.enVivo && (
            <a href={idea.enVivo} target="_blank" rel="noreferrer" className="boton-primario">
              {t.abrirApp} <ArrowUpRight size={16} />
            </a>
          )}
          {idea.repo && (
            <a href={idea.repo} target="_blank" rel="noreferrer" className="boton-secundario">
              <Github size={16} /> {t.codigo}
            </a>
          )}
          {idea.detalle && <BotonCopiar texto={generarFicha(idea)} etiqueta={t.copiarFicha} />}
        </div>
      </header>

      {b ? (
        <div className="mt-10 grid gap-4">
          {PASOS.map((paso) => {
            const campos = paso.campos.filter((c) => !OMITIR.has(c.campo) && (!c.opcional || b[c.campo]));
            if (!campos.length) return null;
            return (
              <section key={paso.titulo} className="rounded-3xl border border-linea bg-hoja p-5 sm:p-6">
                <h2 className="font-titulo text-2xl font-bold">{paso.titulo}</h2>
                <dl className="mt-4 grid gap-4">
                  {campos.map((def) => (
                    <div key={def.campo}>
                      <dt className="text-sm text-tenue">{def.etiqueta}</dt>
                      <dd className="mt-1 whitespace-pre-line">
                        {def.tipo === "lista" ? (
                          <ul className="list-disc pl-5">
                            {b.funcionalidades.map((f) => (
                              <li key={f}>{f}</li>
                            ))}
                          </ul>
                        ) : def.tipo === "pantallas" ? (
                          <ul className="grid gap-1">
                            {b.pantallas.map((p) => (
                              <li key={p.nombre}>
                                <strong>{p.nombre}:</strong> {p.descripcion}
                              </li>
                            ))}
                          </ul>
                        ) : def.tipo === "colores" ? (
                          <span className="flex gap-3">
                            {Object.entries(b.colores).map(([k, c]) => (
                              <span key={k} className="grid gap-1 text-xs text-tenue">
                                <span className="h-10 w-16 rounded-lg border border-linea" style={{ background: c }} />
                                {k} {c}
                              </span>
                            ))}
                          </span>
                        ) : (
                          String(b[def.campo])
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>
      ) : (
        <p className="mt-10 rounded-3xl border border-dashed border-linea p-6 text-tenue">
          {t.sinFicha}
        </p>
      )}

      {puedeGuardar() && (
        <div className="mt-10">
          <EditarIdea idea={idea} pideClave={Boolean(process.env.CLAVE_EDICION)} />
        </div>
      )}
    </main>
  );
}
