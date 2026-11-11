import Lista from "@/components/Lista";
import Portada from "@/components/Portada";
import { leerIdeas } from "@/lib/github";
import { leerIdioma } from "@/lib/idioma";

export const dynamic = "force-dynamic";

export default async function Inicio() {
  const [ideas, idioma] = await Promise.all([leerIdeas(), leerIdioma()]);
  return (
    <Portada ideas={ideas} idioma={idioma}>
      <Lista ideas={ideas} idioma={idioma} />
    </Portada>
  );
}
