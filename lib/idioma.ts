import "server-only";
import { cookies } from "next/headers";
import { COOKIE_IDIOMA, esIdioma, type Idioma } from "./i18n";

/** Idioma guardado por el engrane de ajustes (cookie); español por defecto. */
export async function leerIdioma(): Promise<Idioma> {
  const valor = (await cookies()).get(COOKIE_IDIOMA)?.value;
  return esIdioma(valor) ? valor : "es";
}
