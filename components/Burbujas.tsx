"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, FileText, Github, X } from "lucide-react";
import Presentacion from "./Presentacion";
import Tap from "./Tap";
import { EtiquetaEstado } from "./Estado";
import { resumenDe, stackDe, TEXTOS, type Idioma } from "@/lib/i18n";
import type { Idea } from "@/lib/types";

/** Estado físico de cada burbuja: posición, velocidad, radio y si está reventada. */
interface Cuerpo {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  reventada: boolean;
  /** Aún viene subiendo desde abajo de la pantalla (no rebota en el piso). */
  entrando: boolean;
}

interface Gota {
  id: number;
  x: number;
  y: number;
  color: string;
  r: number;
  piezas: { dx: number; dy: number; tam: number }[];
}

// Cada burbuja tiene su propio tono para que el conjunto se vea iridiscente
const tono = (n: number, total: number) => Math.round((n * 360) / Math.max(total, 1) + 190) % 360;

/** Rapidez objetivo en px/s: ni tan calmada ni frenética. */
const RAPIDEZ = [70, 125] as const;

/** Cuánto dura el frenado después del disparo inicial, en segundos. */
const FRENADO = 2.2;

/**
 * Protector de pantalla de burbujas: una por proyecto, rebotan entre ellas y contra
 * las orillas. Al montarse, se disparan desde abajo. Al tocar una, revienta y abre la
 * ficha del proyecto en un pop up. Con `saliendo`, revientan todas y avisa con `onSalida`.
 */
export default function Burbujas({
  ideas,
  idioma,
  saliendo = false,
  onSalida,
  onRecargar,
  onVacio,
}: {
  ideas: Idea[];
  idioma: Idioma;
  saliendo?: boolean;
  onSalida?: () => void;
  /** Cuando ya no queda ninguna, el aro baja y se vuelven a soplar todas. */
  onRecargar?: () => void;
  /** Avisa cuando se muestra el aro, para que los botones de abajo suban al centro. */
  onVacio?: (vacio: boolean) => void;
}) {
  const t = TEXTOS[idioma];
  const arena = useRef<HTMLDivElement>(null);
  const nodos = useRef<(HTMLButtonElement | null)[]>([]);
  const cuerpos = useRef<Cuerpo[]>([]);
  const [listo, setListo] = useState(false);
  const [abierta, setAbierta] = useState<number | null>(null);
  // Burbujas ya reventadas: desaparecen hasta que se recargan
  const [fase, setFase] = useState<Record<number, "reventando">>({});
  const [aroBajando, setAroBajando] = useState(false);
  // proyectos vistos: sube al cerrar cada vista previa
  const [vistos, setVistos] = useState(0);
  const [gotas, setGotas] = useState<Gota[]>([]);
  const [destello, setDestello] = useState(false);

  // Coloca las burbujas sin encimarse, con radio según el tamaño de la pantalla
  useLayoutEffect(() => {
    const caja = arena.current;
    if (!caja) return;
    const { width: W, height: H } = caja.getBoundingClientRect();
    const base = Math.min(88, Math.max(36, Math.sqrt((W * H * 0.3) / (ideas.length * Math.PI))));
    const lentitud = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.25 : 1;
    const lista: Cuerpo[] = [];
    // Disparo: todas arrancan debajo del borde inferior, escalonadas, y salen hacia arriba
    ideas.forEach((_, i) => {
      const r = base * (0.86 + Math.random() * 0.28);
      const x = r + ((i + 0.5) / ideas.length) * Math.max(1, W - 2 * r) + (Math.random() - 0.5) * r;
      const y = H + r + Math.random() * H * 0.45;
      const v = (H * 1.1 + Math.random() * H * 0.9) * (lentitud < 1 ? 0.6 : 1);
      const desvio = (Math.random() - 0.5) * 0.7;
      lista.push({ x, y, r, vx: Math.sin(desvio) * v, vy: -Math.cos(desvio) * v, reventada: false, entrando: true });
    });
    for (const c of lista) c.x = Math.min(W - c.r, Math.max(c.r, c.x));
    cuerpos.current = lista;
    setListo(true);
  }, [ideas]);

  // Bucle de animación: mueve, rebota y pinta con transform (sin re-render de React)
  useEffect(() => {
    if (!listo) return;
    const caja = arena.current!;
    let W = caja.clientWidth;
    let H = caja.clientHeight;
    const medir = () => {
      W = caja.clientWidth;
      H = caja.clientHeight;
    };
    const obs = new ResizeObserver(medir);
    obs.observe(caja);

    const inicio = performance.now();
    let anterior = inicio;
    let cuadro = 0;
    const paso = (ahora: number) => {
      const dt = Math.min(0.05, (ahora - anterior) / 1000); // si la pestaña estuvo oculta, no salta
      anterior = ahora;
      const cs = cuerpos.current;

      for (const c of cs) {
        if (c.reventada) continue;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        if (c.x < c.r) { c.x = c.r; c.vx = Math.abs(c.vx); }
        if (c.x > W - c.r) { c.x = W - c.r; c.vx = -Math.abs(c.vx); }
        if (c.y < c.r) { c.y = c.r; c.vy = Math.abs(c.vy); }
        if (c.entrando && c.y < H - c.r) c.entrando = false;
        if (!c.entrando && c.y > H - c.r) { c.y = H - c.r; c.vy = -Math.abs(c.vy); }
      }

      // Choques elásticos entre burbujas (masa proporcional al área)
      for (let i = 0; i < cs.length; i++) {
        const a = cs[i];
        if (a.reventada || a.entrando) continue;
        for (let j = i + 1; j < cs.length; j++) {
          const b = cs[j];
          if (b.reventada || b.entrando) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const minimo = a.r + b.r;
          if (dist >= minimo) continue;
          const nx = dx / dist;
          const ny = dy / dist;
          const ma = a.r * a.r;
          const mb = b.r * b.r;
          // separa para que no se queden pegadas
          const encimado = minimo - dist;
          a.x -= nx * encimado * (mb / (ma + mb));
          a.y -= ny * encimado * (mb / (ma + mb));
          b.x += nx * encimado * (ma / (ma + mb));
          b.y += ny * encimado * (ma / (ma + mb));
          const rel = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
          if (rel <= 0) continue;
          const impulso = (2 * rel) / (ma + mb);
          a.vx -= impulso * mb * nx;
          a.vy -= impulso * mb * ny;
          b.vx += impulso * ma * nx;
          b.vy += impulso * ma * ny;
        }
      }

      // tras el disparo frenan poco a poco; luego se quedan en una rapidez agradable
      const frenando = (ahora - inicio) / 1000 < FRENADO;
      cs.forEach((c, i) => {
        const v = Math.hypot(c.vx, c.vy) || 1;
        const objetivo = Math.min(Math.max(v, RAPIDEZ[0] * 0.6), RAPIDEZ[1] * 1.2);
        const k = c.entrando ? 0 : frenando ? 0.022 : 0.05;
        c.vx *= 1 + ((objetivo - v) / v) * k;
        c.vy *= 1 + ((objetivo - v) / v) * k;
        const nodo = nodos.current[i];
        if (nodo) nodo.style.transform = `translate3d(${c.x - c.r}px, ${c.y - c.r}px, 0)`;
      });
      cuadro = requestAnimationFrame(paso);
    };
    cuadro = requestAnimationFrame(paso);
    return () => {
      cancelAnimationFrame(cuadro);
      obs.disconnect();
    };
  }, [listo]);

  const estallar = useCallback(
    (i: number) => {
      const c = cuerpos.current[i];
      if (!c || c.reventada) return false;
      c.reventada = true;
      setFase((f) => ({ ...f, [i]: "reventando" }));
      const piezas = Array.from({ length: 16 }, (_, k) => {
        const ang = (k / 16) * Math.PI * 2 + Math.random() * 0.3;
        const dist = c.r * (1.1 + Math.random() * 0.7);
        return { dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist, tam: 3 + Math.random() * 5 };
      });
      const id = Date.now() + i;
      setGotas((g) => [...g, { id, x: c.x, y: c.y, r: c.r, color: `hsl(${tono(i, ideas.length)} 90% 75%)`, piezas }]);
      window.setTimeout(() => setGotas((g) => g.filter((x) => x.id !== id)), 700);
      return true;
    },
    [ideas.length],
  );

  const reventar = (i: number) => {
    if (saliendo) return;
    if (estallar(i)) window.setTimeout(() => setAbierta(i), 260);
  };

  // Explosión total: revientan todas en cadena, destello, y luego se pasa al listado
  useEffect(() => {
    if (!saliendo) return;
    setAbierta(null);
    const orden = cuerpos.current.map((_, i) => i).sort(() => Math.random() - 0.5);
    const timers = orden.map((i, n) => window.setTimeout(() => estallar(i), n * 45));
    const fin = orden.length * 45;
    timers.push(window.setTimeout(() => setDestello(true), fin));
    timers.push(window.setTimeout(() => onSalida?.(), fin + 420));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saliendo]);

  // Al cerrar la ficha, la burbuja reventada ya no vuelve
  const cerrar = useCallback(() => {
    if (abierta === null) return;
    setAbierta(null);
    setVistos((v) => Math.min(v + 1, ideas.length));
  }, [abierta, ideas.length]);

  const sinBurbujas = listo && Object.keys(fase).length >= ideas.length;
  const mostrarAro = sinBurbujas && abierta === null && !saliendo;
  const vacio = mostrarAro && !aroBajando;
  useEffect(() => {
    onVacio?.(vacio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vacio]);

  const recargar = () => {
    if (aroBajando) return;
    setAroBajando(true);
    window.setTimeout(() => onRecargar?.(), 650);
  };

  useEffect(() => {
    if (abierta === null) return;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [abierta, cerrar]);

  const idea = abierta !== null ? ideas[abierta] : null;

  return (
    <section className="flex h-[100svh] flex-col overflow-hidden">
      <div className="shrink-0 animate-[aparecer_500ms_ease-out_both] px-16 pb-2 pt-16 text-center sm:pt-8">
        <p className="font-firma text-xs font-medium uppercase tracking-[0.25em] text-tenue">
          {t.titulo.join(" ")}
          <span className="hidden sm:inline"> · Brian Hawkins</span>
        </p>
        <h1 className="mx-auto mt-2 max-w-2xl font-titulo text-2xl font-bold leading-tight sm:text-4xl">
          {t.instruccionBurbujas}
        </h1>
      </div>

      <div ref={arena} className="relative min-h-0 flex-1">
        {listo &&
          ideas.map((p, i) => {
            const c = cuerpos.current[i];
            const h = tono(i, ideas.length);
            return (
              <button
                key={p.numero}
                ref={(el) => {
                  nodos.current[i] = el;
                }}
                type="button"
                onClick={() => reventar(i)}
                tabIndex={fase[i] ? -1 : 0}
                aria-hidden={fase[i] ? true : undefined}
                aria-label={`${t.proyecto} ${p.numero}: ${p.nombre}`}
                className="burbuja absolute left-0 top-0 rounded-full focus:outline-none"
                style={{
                  width: c.r * 2,
                  height: c.r * 2,
                  transform: `translate3d(${c.x - c.r}px, ${c.y - c.r}px, 0)`,
                  ["--h" as string]: h,
                  ["--retraso" as string]: `${-i * 0.7}s`,
                }}
              >
                <span className={`burbuja-cuerpo ${fase[i] ?? ""}`}>
                  <span className="burbuja-iris" />
                  <span className="burbuja-brillo" />
                  <span className="burbuja-brillo-2" />
                  <span
                    className="relative font-titulo font-black leading-none text-tinta"
                    style={{ fontSize: c.r * 0.72 }}
                  >
                    {p.numero}
                  </span>
                </span>
              </button>
            );
          })}

        {gotas.map((g) => (
          <span key={g.id} aria-hidden className="pointer-events-none absolute" style={{ left: g.x, top: g.y }}>
            <span className="onda" style={{ borderColor: g.color, ["--tam" as string]: `${g.r * 3.2}px` }} />
            {g.piezas.map((p, k) => (
              <span
                key={k}
                className="gota"
                style={{
                  width: p.tam,
                  height: p.tam,
                  background: g.color,
                  ["--dx" as string]: `${p.dx}px`,
                  ["--dy" as string]: `${p.dy}px`,
                }}
              />
            ))}
          </span>
        ))}
      </div>

      {Object.keys(fase).length > 0 && !saliendo && (
        <div
          role="status"
          aria-live="polite"
          className="fixed left-4 top-4 z-40 animate-[aparecer_300ms_ease-out] sm:left-6 sm:top-6"
        >
          <span
            key={vistos}
            className={`inline-flex items-baseline gap-1.5 rounded-full border border-linea bg-hoja/90 px-4 py-2 text-sm text-tenue shadow-sm backdrop-blur ${vistos ? "contador-late" : ""}`}
          >
            {t.vistos}:
            <span className="inline-flex items-baseline font-titulo text-lg font-bold leading-none tabular-nums">
              <span className="inline-flex overflow-hidden text-tinta">
                <span key={vistos} className="contador-sube">
                  {vistos}
                </span>
              </span>
              <span className="text-tenue">/{ideas.length}</span>
            </span>
          </span>
        </div>
      )}

      {mostrarAro && (
        <div className="pointer-events-none fixed inset-x-0 top-0 bottom-[calc(20svh+120px)] z-20 flex items-end justify-center px-6 pb-2">
          <button
            type="button"
            onClick={recargar}
            className={`aro pointer-events-auto ${aroBajando ? "aro-baja" : ""}`}
            aria-label={t.recargar}
          >
            <svg viewBox="0 0 200 290" className="aro-svg" aria-hidden>
              <defs>
                <linearGradient id="aro-borde" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="rgb(var(--tomate))" />
                  <stop offset="0.5" stopColor="rgb(var(--mostaza))" />
                  <stop offset="1" stopColor="rgb(var(--menta))" />
                </linearGradient>
                <radialGradient id="aro-pelicula" cx="0.35" cy="0.3" r="0.8">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
                  <stop offset="0.55" stopColor="hsl(200 90% 70%)" stopOpacity="0.08" />
                  <stop offset="0.85" stopColor="hsl(300 90% 70%)" stopOpacity="0.2" />
                  <stop offset="1" stopColor="hsl(50 90% 70%)" stopOpacity="0.35" />
                </radialGradient>
              </defs>
              <rect x="94" y="186" width="12" height="100" rx="6" fill="url(#aro-borde)" />
              <circle cx="100" cy="98" r="84" fill="url(#aro-pelicula)" className="aro-pelicula" />
              <circle cx="100" cy="98" r="84" fill="none" stroke="url(#aro-borde)" strokeWidth="10" />
            </svg>
            {!aroBajando && <Tap retraso={2700} className="left-[62%] top-[44%]" />}
            <span className="aro-texto font-titulo text-sm font-bold leading-tight text-tinta/85 sm:text-[15px]">
              {t.recargar}
            </span>
            {[0, 1, 2, 3, 4].map((k) => (
              <span key={k} aria-hidden className="aro-soplo" style={{ ["--k" as string]: k }} />
            ))}
          </button>
        </div>
      )}

      {destello && <div aria-hidden className="destello pointer-events-none fixed inset-0 z-40" />}

      {idea && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ficha-burbuja"
          className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4 backdrop-blur-sm animate-[aparecer_180ms_ease-out]"
          onClick={(e) => e.target === e.currentTarget && cerrar()}
        >
          <article className="relative w-full max-w-lg animate-[emerger_260ms_cubic-bezier(.2,1.4,.4,1)] rounded-3xl border border-linea bg-hoja p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={cerrar}
              aria-label={t.cerrar}
              autoFocus
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-linea text-tenue transition hover:text-tinta"
            >
              <X size={18} />
            </button>
            <span className="font-titulo text-6xl font-black leading-none text-tomate/90">
              {String(idea.numero).padStart(2, "0")}
            </span>
            <div className="mt-3 flex flex-wrap items-center gap-2 pr-8">
              <h2 id="ficha-burbuja" className="font-titulo text-2xl font-bold leading-tight sm:text-3xl">
                {idea.nombre}
              </h2>
              <EtiquetaEstado estado={idea.estado} idioma={idioma} />
            </div>
            <p className="mt-3 text-tenue">{resumenDe(idea, idioma)}</p>
            <p className="mt-3 text-xs text-tenue">{stackDe(idea, idioma)}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {idea.enVivo && (
                <a href={idea.enVivo} target="_blank" rel="noreferrer" className="boton-primario px-4 py-2">
                  {t.abrir} <ArrowUpRight size={15} />
                </a>
              )}
              {idea.repo && (
                <a href={idea.repo} target="_blank" rel="noreferrer" className="boton-secundario px-4 py-2">
                  <Github size={15} /> {t.codigo}
                </a>
              )}
              {!!idea.presentacion?.length && (
                <Presentacion slides={idea.presentacion} titulo={idea.nombre} idioma={idioma} />
              )}
              <Link href={`/idea/${idea.numero}`} className="boton-secundario px-4 py-2">
                <FileText size={15} /> {t.fichaCompleta}
              </Link>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
