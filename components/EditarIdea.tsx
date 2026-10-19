"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { ESTADOS, type Estado, type Idea } from "@/lib/types";

/** Cambia el estado y los enlaces de una idea conforme avanza. Guarda con un commit en GitHub. */
export default function EditarIdea({ idea, pideClave }: { idea: Idea; pideClave: boolean }) {
  const router = useRouter();
  const [estado, setEstado] = useState<Estado>(idea.estado);
  const [repo, setRepo] = useState(idea.repo);
  const [enVivo, setEnVivo] = useState(idea.enVivo);
  const [clave, setClave] = useState("");

  useEffect(() => {
    try {
      setClave(localStorage.getItem("101gi-clave") ?? "");
    } catch {}
  }, []);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cambios = estado !== idea.estado || repo !== idea.repo || enVivo !== idea.enVivo;

  async function guardar() {
    setGuardando(true);
    setMensaje("");
    try {
      const res = await fetch("/api/ideas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero: idea.numero, estado, repo, enVivo, clave }),
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos.error ?? "No se pudo guardar.");
      try {
        if (clave) localStorage.setItem("101gi-clave", clave);
      } catch {}
      setMensaje("Guardado en GitHub.");
      router.refresh();
    } catch (e) {
      setMensaje((e as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="rounded-3xl border border-linea bg-hoja p-5">
      <h2 className="font-titulo text-xl font-bold">Actualizar avance</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {ESTADOS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setEstado(e)}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${e === estado ? "border-tomate bg-tomate text-white" : "border-linea hover:border-tinta/40"}`}
          >
            {e}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Repositorio
          <input className="campo mt-1" type="url" placeholder="https://github.com/…" value={repo} onChange={(e) => setRepo(e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          Enlace en vivo
          <input className="campo mt-1" type="url" placeholder="https://…vercel.app" value={enVivo} onChange={(e) => setEnVivo(e.target.value)} />
        </label>
        {pideClave && (
          <label className="text-sm font-medium sm:col-span-2">
            Clave de edición
            <input className="campo mt-1" type="password" value={clave} onChange={(e) => setClave(e.target.value)} />
          </label>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className="boton-primario" disabled={!cambios || guardando || (pideClave && !clave)} onClick={guardar}>
          {guardando ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Guardar cambios
        </button>
        {mensaje && <p className="text-sm text-tenue">{mensaje}</p>}
      </div>
    </div>
  );
}
