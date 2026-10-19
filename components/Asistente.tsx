"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, Download, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { BORRADOR_VACIO, PASOS, validar, type Borrador, type Campo, type DefCampo } from "@/lib/formulario";
import { borradorAIdea } from "@/lib/ideas";
import { archivoDeIdea, generarFicha } from "@/lib/markdown";
import type { Idea } from "@/lib/types";

const LLAVE_BORRADOR = "101gi-borrador";
const LLAVE_CLAVE = "101gi-clave";

function leerLocal(llave: string): string | null {
  try {
    return localStorage.getItem(llave);
  } catch {
    return null;
  }
}
function guardarLocal(llave: string, valor: string | null) {
  try {
    if (valor === null) localStorage.removeItem(llave);
    else localStorage.setItem(llave, valor);
  } catch {}
}

type Errores = Partial<Record<Campo, string>>;

export default function Asistente({
  siguiente,
  puedeGuardar,
  pideClave,
}: {
  siguiente: number;
  puedeGuardar: boolean;
  pideClave: boolean;
}) {
  const [b, setB] = useState<Borrador>(BORRADOR_VACIO);
  const [paso, setPaso] = useState(0);
  const [errores, setErrores] = useState<Errores>({});
  const [clave, setClave] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [fallo, setFallo] = useState("");
  const [guardada, setGuardada] = useState<Idea | null>(null);
  const [cargado, setCargado] = useState(false);
  const arriba = useRef<HTMLDivElement>(null);

  const revision = paso === PASOS.length;

  useEffect(() => {
    const previo = leerLocal(LLAVE_BORRADOR);
    if (previo) {
      try {
        setB({ ...BORRADOR_VACIO, ...JSON.parse(previo) });
      } catch {}
    }
    setClave(leerLocal(LLAVE_CLAVE) ?? "");
    setCargado(true);
  }, []);

  useEffect(() => {
    if (cargado && !guardada) guardarLocal(LLAVE_BORRADOR, JSON.stringify(b));
  }, [b, cargado, guardada]);

  function cambiar<K extends Campo>(campo: K, valor: Borrador[K]) {
    setB((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: undefined }));
  }

  function irA(n: number) {
    setPaso(n);
    setErrores({});
    arriba.current?.scrollIntoView({ behavior: "smooth" });
  }

  function avanzar() {
    const e = validar(b, PASOS[paso].campos);
    if (Object.keys(e).length) {
      setErrores(e);
      const primero = PASOS[paso].campos.find((c) => e[c.campo]);
      document.getElementById(`campo-${primero?.campo}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    irA(paso + 1);
  }

  function pasoConFaltantes(): number {
    return PASOS.findIndex((p) => Object.keys(validar(b, p.campos)).length > 0);
  }

  async function guardar() {
    const pendiente = pasoConFaltantes();
    if (pendiente >= 0) {
      irA(pendiente);
      setErrores(validar(b, PASOS[pendiente].campos));
      return;
    }
    setGuardando(true);
    setFallo("");
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrador: b, clave }),
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos.error ?? "No se pudo guardar.");
      guardarLocal(LLAVE_BORRADOR, null);
      if (clave) guardarLocal(LLAVE_CLAVE, clave);
      setGuardada(datos.idea);
      arriba.current?.scrollIntoView({ behavior: "smooth" });
    } catch (e) {
      setFallo((e as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  function descartar() {
    guardarLocal(LLAVE_BORRADOR, null);
    setB(BORRADOR_VACIO);
    irA(0);
  }

  const vistaPrevia = borradorAIdea(b, guardada?.numero ?? siguiente);
  const ficha = generarFicha(guardada ?? vistaPrevia);

  if (guardada) return <Guardada idea={guardada} ficha={ficha} />;

  return (
    <div ref={arriba} className="scroll-mt-6">
      <Progreso paso={paso} irA={(n) => n < paso && irA(n)} />

      {!revision ? (
        <section className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-tomate">
            Paso {paso + 1} de {PASOS.length} · {PASOS[paso].titulo}
          </p>
          <h1 className="mt-2 font-titulo text-4xl font-bold leading-tight sm:text-5xl">{PASOS[paso].pregunta}</h1>
          <div className="mt-8 grid gap-7">
            {PASOS[paso].campos.map((def) => (
              <CampoForm key={def.campo} def={def} b={b} cambiar={cambiar} error={errores[def.campo]} />
            ))}
          </div>
          {Object.values(errores).some(Boolean) && (
            <p className="mt-6 rounded-xl bg-tomate/10 px-4 py-3 text-sm font-medium text-tomate">
              Faltan algunos datos de este paso. Están marcados arriba.
            </p>
          )}
        </section>
      ) : (
        <Revision b={b} numero={siguiente} irA={irA} />
      )}

      <div className="sticky bottom-0 -mx-4 mt-10 border-t border-linea bg-papel/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
        {revision && pideClave && puedeGuardar && (
          <label className="mb-3 block">
            <span className="text-sm font-medium">Clave de edición</span>
            <input
              type="password"
              className="campo mt-1"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="La que pusiste en Vercel como CLAVE_EDICION"
            />
          </label>
        )}
        {fallo && <p className="mb-3 rounded-xl bg-tomate/10 px-4 py-3 text-sm font-medium text-tomate">{fallo}</p>}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {paso > 0 ? (
              <button type="button" className="boton-secundario" onClick={() => irA(paso - 1)}>
                <ArrowLeft size={16} /> Atrás
              </button>
            ) : (
              <Link href="/" className="boton-secundario">
                <X size={16} /> Cancelar
              </Link>
            )}
            {paso === 0 && b.nombre && (
              <button type="button" className="boton text-tenue hover:text-tinta" onClick={descartar}>
                Empezar de cero
              </button>
            )}
          </div>
          {!revision ? (
            <button type="button" className="boton-primario" onClick={avanzar}>
              {paso === PASOS.length - 1 ? "Revisar" : "Siguiente"} <ArrowRight size={16} />
            </button>
          ) : puedeGuardar ? (
            <button type="button" className="boton-primario" onClick={guardar} disabled={guardando || (pideClave && !clave)}>
              {guardando ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {guardando ? "Guardando en GitHub…" : `Guardar idea #${siguiente}`}
            </button>
          ) : (
            <DescargarFicha ficha={ficha} nombre={archivoDeIdea(vistaPrevia)} />
          )}
        </div>
        {revision && !puedeGuardar && (
          <p className="mt-3 text-sm text-tenue">
            Para guardar directo en GitHub falta configurar <code>GITHUB_TOKEN</code> en Vercel (el README explica cómo). Mientras,
            descarga la ficha.
          </p>
        )}
      </div>
    </div>
  );
}

function Progreso({ paso, irA }: { paso: number; irA: (n: number) => void }) {
  const nombres = [...PASOS.map((p) => p.titulo), "Revisión"];
  return (
    <nav aria-label="Pasos" className="flex gap-1.5">
      {nombres.map((nombre, n) => (
        <button
          key={nombre}
          type="button"
          onClick={() => irA(n)}
          className="group flex-1 text-left"
          aria-current={n === paso ? "step" : undefined}
          disabled={n >= paso}
        >
          <span className={`block h-1.5 rounded-full ${n <= paso ? "bg-tomate" : "bg-linea"}`} />
          <span className={`mt-2 hidden text-xs sm:block ${n === paso ? "font-semibold text-tinta" : "text-tenue"} ${n < paso ? "group-hover:text-tinta" : ""}`}>
            {nombre}
          </span>
        </button>
      ))}
    </nav>
  );
}

function CampoForm({
  def,
  b,
  cambiar,
  error,
}: {
  def: DefCampo;
  b: Borrador;
  cambiar: <K extends Campo>(campo: K, valor: Borrador[K]) => void;
  error?: string;
}) {
  const id = `campo-${def.campo}`;
  const valor = b[def.campo];
  const borde = error ? "border-tomate" : "";

  let control: React.ReactNode;
  switch (def.tipo) {
    case "texto":
    case "url":
      control = (
        <input
          id={id}
          type={def.tipo === "url" ? "url" : "text"}
          className={`campo ${borde}`}
          value={valor as string}
          maxLength={def.maxLargo}
          placeholder={def.tipo === "url" ? "https://" : def.ejemplo ? `Ej. ${def.ejemplo}` : ""}
          onChange={(e) => cambiar(def.campo, e.target.value as never)}
        />
      );
      break;
    case "fecha":
      control = (
        <input id={id} type="date" className={`campo ${borde} sm:max-w-xs`} value={valor as string} onChange={(e) => cambiar(def.campo, e.target.value as never)} />
      );
      break;
    case "parrafo":
      control = (
        <textarea
          id={id}
          rows={3}
          className={`campo ${borde} resize-y`}
          value={valor as string}
          placeholder={def.ejemplo ? `Ej. ${def.ejemplo}` : ""}
          onChange={(e) => cambiar(def.campo, e.target.value as never)}
        />
      );
      break;
    case "opciones":
      control = (
        <select id={id} className={`campo ${borde}`} value={valor as string} onChange={(e) => cambiar(def.campo, e.target.value as never)}>
          <option value="">Elige una…</option>
          {def.opciones?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      );
      break;
    case "botones":
      control = (
        <div id={id} role="radiogroup" className="flex flex-wrap gap-2">
          {def.opciones?.map((o) => {
            const activo = valor === o;
            return (
              <button
                key={o}
                type="button"
                role="radio"
                aria-checked={activo}
                onClick={() => cambiar(def.campo, o as never)}
                className={`rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                  activo ? "border-tomate bg-tomate text-white" : `bg-hoja hover:border-tinta/40 ${error ? "border-tomate" : "border-linea"}`
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
      );
      break;
    case "lista": {
      const items = valor as string[];
      control = (
        <div id={id} className="grid gap-2">
          {items.map((t, n) => (
            <div key={n} className="flex gap-2">
              <span className="grid w-8 shrink-0 place-items-center font-titulo text-lg font-bold text-tomate">{n + 1}</span>
              <input
                className={`campo ${error && !t.trim() ? "border-tomate" : ""}`}
                value={t}
                placeholder={n === 0 && def.ejemplo ? `Ej. ${def.ejemplo}` : ""}
                onChange={(e) => cambiar(def.campo, items.map((x, i) => (i === n ? e.target.value : x)) as never)}
              />
              {items.length > 1 && (
                <button
                  type="button"
                  aria-label="Quitar"
                  className="grid w-11 shrink-0 place-items-center rounded-xl text-tenue hover:bg-hoja hover:text-tomate"
                  onClick={() => cambiar(def.campo, items.filter((_, i) => i !== n) as never)}
                >
                  <Trash2 size={17} />
                </button>
              )}
            </div>
          ))}
          <button type="button" className="boton-secundario w-fit px-4 py-2" onClick={() => cambiar(def.campo, [...items, ""] as never)}>
            <Plus size={15} /> Agregar otra
          </button>
        </div>
      );
      break;
    }
    case "pantallas": {
      const pantallas = valor as Borrador["pantallas"];
      const set = (n: number, k: "nombre" | "descripcion", v: string) =>
        cambiar("pantallas", pantallas.map((p, i) => (i === n ? { ...p, [k]: v } : p)));
      control = (
        <div id={id} className="grid gap-3">
          {pantallas.map((p, n) => (
            <div key={n} className="grid gap-2 rounded-2xl border border-linea bg-hoja/60 p-3 sm:grid-cols-[1fr,2fr,auto]">
              <input className="campo" value={p.nombre} placeholder={n === 0 ? "Ej. Pase de lista" : "Nombre"} onChange={(e) => set(n, "nombre", e.target.value)} />
              <input
                className="campo"
                value={p.descripcion}
                placeholder={n === 0 ? "Ej. Marcar presente, retardo o falta por elemento" : "Qué se hace aquí"}
                onChange={(e) => set(n, "descripcion", e.target.value)}
              />
              {pantallas.length > 1 && (
                <button
                  type="button"
                  aria-label="Quitar pantalla"
                  className="grid h-11 w-11 place-items-center justify-self-end rounded-xl text-tenue hover:text-tomate"
                  onClick={() => cambiar("pantallas", pantallas.filter((_, i) => i !== n))}
                >
                  <Trash2 size={17} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="boton-secundario w-fit px-4 py-2"
            onClick={() => cambiar("pantallas", [...pantallas, { nombre: "", descripcion: "" }])}
          >
            <Plus size={15} /> Agregar pantalla
          </button>
        </div>
      );
      break;
    }
    case "colores": {
      const c = valor as Borrador["colores"];
      const nombres = { primario: "Primario", secundario: "Secundario", fondo: "Fondo" } as const;
      control = (
        <div id={id} className="grid grid-cols-3 gap-3 sm:max-w-md">
          {(Object.keys(nombres) as (keyof typeof nombres)[]).map((k) => (
            <label key={k} className="grid gap-1.5 text-sm">
              <input
                type="color"
                value={c[k]}
                onChange={(e) => cambiar("colores", { ...c, [k]: e.target.value })}
                className="h-16 w-full cursor-pointer rounded-xl border border-linea bg-hoja p-1"
              />
              <span className="font-medium">{nombres[k]}</span>
              <span className="font-mono text-xs uppercase text-tenue">{c[k]}</span>
            </label>
          ))}
        </div>
      );
      break;
    }
  }

  return (
    <div className="scroll-mt-24">
      <label htmlFor={id} className="block font-semibold">
        {def.etiqueta}
        {def.opcional && <span className="ml-2 text-sm font-normal text-tenue">opcional</span>}
      </label>
      {def.ayuda && <p className="mb-2 mt-0.5 text-sm text-tenue">{def.ayuda}</p>}
      <div className={def.ayuda ? "" : "mt-2"}>{control}</div>
      {error && <p className="mt-1.5 text-sm font-medium text-tomate">{error}</p>}
    </div>
  );
}

function mostrar(def: DefCampo, b: Borrador): string {
  const v = b[def.campo];
  if (def.tipo === "lista") return (v as string[]).filter((t) => t.trim()).map((t) => `• ${t}`).join("\n");
  if (def.tipo === "pantallas")
    return (v as Borrador["pantallas"]).filter((p) => p.nombre.trim()).map((p) => `• ${p.nombre}: ${p.descripcion}`).join("\n");
  if (def.tipo === "colores") return "";
  return String(v || "—");
}

function Revision({ b, numero, irA }: { b: Borrador; numero: number; irA: (n: number) => void }) {
  return (
    <section className="mt-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-tomate">Revisión</p>
      <h1 className="mt-2 font-titulo text-4xl font-bold leading-tight sm:text-5xl">
        #{numero} · {b.nombre}
      </h1>
      <p className="mt-2 text-lg text-tenue">{b.resumen}</p>
      <div className="mt-8 grid gap-4">
        {PASOS.map((p, n) => (
          <div key={p.titulo} className="rounded-3xl border border-linea bg-hoja p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-titulo text-xl font-bold">{p.titulo}</h2>
              <button type="button" className="boton text-tenue hover:text-tinta px-3 py-1.5" onClick={() => irA(n)}>
                <Pencil size={14} /> Editar
              </button>
            </div>
            <dl className="mt-3 grid gap-3">
              {p.campos.map((def) => (
                <div key={def.campo} className="grid gap-0.5 sm:grid-cols-[200px,1fr] sm:gap-4">
                  <dt className="text-sm text-tenue">{def.etiqueta}</dt>
                  <dd className="whitespace-pre-line text-sm">
                    {def.tipo === "colores" ? (
                      <span className="flex gap-2">
                        {Object.values(b.colores).map((c) => (
                          <span key={c} className="h-6 w-10 rounded-md border border-linea" style={{ background: c }} title={c} />
                        ))}
                      </span>
                    ) : (
                      mostrar(def, b)
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}

function DescargarFicha({ ficha, nombre }: { ficha: string; nombre: string }) {
  return (
    <button
      type="button"
      className="boton-primario"
      onClick={() => {
        const url = URL.createObjectURL(new Blob([ficha], { type: "text/markdown" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = nombre.replace("ideas/", "");
        a.click();
        URL.revokeObjectURL(url);
      }}
    >
      <Download size={16} /> Descargar ficha
    </button>
  );
}

function BotonCopiar({ texto, etiqueta }: { texto: string; etiqueta: string }) {
  const [listo, setListo] = useState(false);
  return (
    <button
      type="button"
      className="boton-secundario"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(texto);
          setListo(true);
          setTimeout(() => setListo(false), 2000);
        } catch {}
      }}
    >
      {listo ? <Check size={16} /> : <Copy size={16} />} {listo ? "Copiado" : etiqueta}
    </button>
  );
}

function Guardada({ idea, ficha }: { idea: Idea; ficha: string }) {
  return (
    <section className="py-10 text-center">
      <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-menta text-white">
        <Check size={40} strokeWidth={3} />
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-tomate">Idea #{idea.numero} guardada</p>
      <h1 className="mt-2 font-titulo text-5xl font-black">{idea.nombre}</h1>
      <p className="mx-auto mt-4 max-w-lg text-tenue">
        Ya está en el índice y en GitHub, con su ficha completa. Copia la ficha y pégasela a Claude para empezar a construirla.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <BotonCopiar texto={ficha} etiqueta="Copiar ficha para Claude" />
        <Link href={`/idea/${idea.numero}`} className="boton-secundario">
          Ver ficha
        </Link>
        <Link href="/" className="boton-primario">
          Volver al índice
        </Link>
      </div>
    </section>
  );
}

export { BotonCopiar };
