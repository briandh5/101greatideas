import "server-only";
import { cookies } from "next/headers";
import { COOKIE_IDIOMA, COOKIE_TEMA, esIdioma, type Idioma, type Tema } from "./i18n";

/** Idioma guardado por el engrane de ajustes (cookie); español por defecto. */
export async function leerIdioma(): Promise<Idioma> {
  const valor = (await cookies()).get(COOKIE_IDIOMA)?.value;
  return esIdioma(valor) ? valor : "es";
}

/** Tema guardado por el switch de ajustes; oscuro por defecto. */
export async function leerTema(): Promise<Tema> {
  return (await cookies()).get(COOKIE_TEMA)?.value === "claro" ? "claro" : "oscuro";
}
