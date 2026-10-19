import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Asistente from "@/components/Asistente";
import { leerIdeas, puedeGuardar } from "@/lib/github";
import { siguienteNumero } from "@/lib/ideas";

export const dynamic = "force-dynamic";
export const metadata = { title: "Nueva idea · 101 great ideas" };

export default async function NuevaIdea() {
  const ideas = await leerIdeas();
  return (
    <main className="mx-auto max-w-3xl px-4 pb-10 pt-8 sm:px-6 sm:pt-12">
      <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-tenue hover:text-tinta">
        <ArrowLeft size={15} /> Índice
      </Link>
      <Asistente siguiente={siguienteNumero(ideas)} puedeGuardar={puedeGuardar()} pideClave={Boolean(process.env.CLAVE_EDICION)} />
    </main>
  );
}
