import type { Estado, Idea } from "./types";

export const IDIOMAS = ["es", "en"] as const;
export type Idioma = (typeof IDIOMAS)[number];
export const COOKIE_IDIOMA = "101gi-idioma";

export const esIdioma = (v: unknown): v is Idioma => IDIOMAS.includes(v as Idioma);

const ES = {
  titulo: ["Reto", "101 apps"],
  contactMe: "Contact me",
  nuevaIdea: "Nueva idea",
  publicadas: "publicadas",
  registradas: "registradas",
  abrir: "Abrir",
  codigo: "Código",
  fichaCompleta: "Ficha completa",
  sobreProyecto: "Sobre la guía",
  bio: [
    "Hola, soy Brian Hawkins y me gusta la tecnología y los datos. Mi interés por estas dos áreas me llevó a estudiar la Licenciatura en informática y mi curiosidad me lleva a saber qué se puede hacer cada día con la incorporación de nuevas tecnologías.",
    "Este proyecto nació con la intención de llevar a cabo ideas que sean útiles en el día a día para mis amigos, familia o para mí y que sé que le podrían funcionar a alguien más. La curiosidad me lleva a plasmar y generar contenido de una forma útil o entretenida mientras aprendo e integro tecnologías de desarrollo. Todo lo que nos imaginemos lo podemos hacer posible, lo único y esencial es nunca parar de hacerlo. :)",
  ],
  contacto: "Contacto",
  ajustes: "Ajustes",
  idioma: "Idioma",
  cargandoVista: "Cargando vista previa…",
  sinVivo: "Aún sin versión en vivo",
  clicProyecto: "Clic para ver el proyecto completo",
  irAlProyecto: "Ir al proyecto",
  vistaPreviaDe: "Vista previa de",
  indice: "Índice",
  registradaEl: "Registrada el",
  abrirApp: "Abrir la app",
  copiarFicha: "Copiar ficha para Claude",
  sinFicha: "Esta app se registró antes del formulario, así que no tiene ficha detallada.",
};

const EN: typeof ES = {
  titulo: ["101 apps", "challenge"],
  contactMe: "Contact me",
  nuevaIdea: "New idea",
  publicadas: "live",
  registradas: "registered",
  abrir: "Open",
  codigo: "Code",
  fichaCompleta: "Full sheet",
  sobreProyecto: "About this guide",
  bio: [
    "Hi, I'm Brian Hawkins and I love technology and data. My interest in both led me to earn a Bachelor's degree in Computer Science, and my curiosity keeps me exploring what can be done every day as new technologies come along.",
    "This project was born to bring to life ideas that are useful day to day for my friends, my family or myself, and that I know could work for someone else too. Curiosity drives me to create content that is useful or entertaining while I learn and bring new development technologies together. Anything we can imagine, we can make possible; the one essential thing is to never stop doing it. :)",
  ],
  contacto: "Contact",
  ajustes: "Settings",
  idioma: "Language",
  cargandoVista: "Loading preview…",
  sinVivo: "No live version yet",
  clicProyecto: "Click to see the full project",
  irAlProyecto: "Go to project",
  vistaPreviaDe: "Preview of",
  indice: "Index",
  registradaEl: "Registered on",
  abrirApp: "Open the app",
  copiarFicha: "Copy sheet for Claude",
  sinFicha: "This app was registered before the form existed, so it has no detailed sheet.",
};

export type Textos = typeof ES;
export const TEXTOS: Record<Idioma, Textos> = { es: ES, en: EN };

const ESTADO_EN: Record<Estado, string> = {
  Idea: "Idea",
  "En construcción": "In progress",
  Publicada: "Live",
  "En pausa": "On hold",
};

export const nombreEstado = (estado: Estado, idioma: Idioma) => (idioma === "en" ? ESTADO_EN[estado] : estado);

/** Resumen y stack en el idioma elegido; si la idea no trae traducción, se queda en español. */
export const resumenDe = (idea: Idea, idioma: Idioma) => (idioma === "en" && idea.en?.resumen) || idea.resumen;
export const stackDe = (idea: Idea, idioma: Idioma) => (idioma === "en" && idea.en?.stack) || idea.stack;
