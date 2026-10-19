import { CATEGORIAS, ESTADOS, type Detalle, type Estado } from "./types";

export type Borrador = Detalle & {
  nombre: string;
  resumen: string;
  estado: Estado;
  stack: string;
  repo: string;
  enVivo: string;
};

export type Campo = keyof Borrador;

export type Tipo = "texto" | "parrafo" | "opciones" | "botones" | "lista" | "pantallas" | "colores" | "fecha" | "url";

export interface DefCampo {
  campo: Campo;
  etiqueta: string;
  ayuda: string;
  tipo: Tipo;
  ejemplo?: string;
  opciones?: readonly string[];
  opcional?: boolean;
  minimo?: number; // para listas y pantallas
  maxLargo?: number;
}

export interface Paso {
  titulo: string;
  pregunta: string;
  campos: DefCampo[];
}

export const PASOS: Paso[] = [
  {
    titulo: "La idea",
    pregunta: "¿Qué es, en pocas palabras?",
    campos: [
      { campo: "nombre", etiqueta: "Nombre de la app", ayuda: "Corto y fácil de recordar.", tipo: "texto", ejemplo: "Crecer", maxLargo: 60 },
      {
        campo: "resumen",
        etiqueta: "Qué hace, en una línea",
        ayuda: "Esta frase aparece en el índice. Di qué hace y para quién.",
        tipo: "texto",
        ejemplo: "Acompañamiento del desarrollo infantil para mamás y papás primerizos.",
        maxLargo: 160,
      },
      { campo: "categoria", etiqueta: "Categoría", ayuda: "La que mejor la describa.", tipo: "opciones", opciones: CATEGORIAS },
      { campo: "estado", etiqueta: "¿En qué punto está?", ayuda: "Lo puedes cambiar después.", tipo: "botones", opciones: ESTADOS },
    ],
  },
  {
    titulo: "El problema",
    pregunta: "¿Por qué tiene que existir?",
    campos: [
      {
        campo: "problema",
        etiqueta: "¿Qué problema resuelve?",
        ayuda: "Describe la situación concreta que hoy duele o cuesta trabajo.",
        tipo: "parrafo",
        ejemplo: "Los supervisores pasan lista en papel y la nómina quincenal se arma a mano en Excel, con errores.",
      },
      {
        campo: "usuarios",
        etiqueta: "¿Quién la va a usar?",
        ayuda: "Tipo de persona o empresa, edad, contexto, qué tan cómodos son con la tecnología.",
        tipo: "parrafo",
        ejemplo: "Supervisores de seguridad en campo, con celular Android, y la persona de nómina en oficina.",
      },
      {
        campo: "alternativas",
        etiqueta: "¿Cómo lo resuelven hoy?",
        ayuda: "Otras apps, Excel, papel, WhatsApp… Si no hay nada, dilo.",
        tipo: "parrafo",
      },
      {
        campo: "diferenciador",
        etiqueta: "¿Por qué tu app es mejor?",
        ayuda: "Lo que hace distinta a tu solución.",
        tipo: "parrafo",
      },
    ],
  },
  {
    titulo: "Qué hace",
    pregunta: "¿Qué puede hacer la primera versión?",
    campos: [
      {
        campo: "funcionalidades",
        etiqueta: "Funcionalidades del MVP",
        ayuda: "Una por renglón. Al menos 3. Piensa en verbos: registrar, ver, exportar…",
        tipo: "lista",
        minimo: 3,
        ejemplo: "Pasar lista por turno",
      },
      {
        campo: "pantallas",
        etiqueta: "Pantallas",
        ayuda: "Cada pantalla con su nombre y qué se hace en ella. Al menos 1.",
        tipo: "pantallas",
        minimo: 1,
      },
      {
        campo: "flujo",
        etiqueta: "Flujo principal, paso a paso",
        ayuda: "Lo que hace un usuario típico desde que abre la app hasta que logra su objetivo.",
        tipo: "parrafo",
        ejemplo: "1. Entra con su usuario. 2. Elige el servicio. 3. Marca asistencia de cada elemento. 4. Guarda.",
      },
      {
        campo: "fueraDeAlcance",
        etiqueta: "¿Qué NO entra en la primera versión?",
        ayuda: "Lo que dejas para después. Si todo entra, escribe \"Nada\".",
        tipo: "parrafo",
      },
    ],
  },
  {
    titulo: "Datos y cuentas",
    pregunta: "¿Qué información maneja?",
    campos: [
      {
        campo: "datos",
        etiqueta: "¿Qué datos guarda?",
        ayuda: "Las cosas que se registran y sus campos.",
        tipo: "parrafo",
        ejemplo: "Elemento (nombre, puesto, sueldo diario). Asistencia (fecha, turno, estatus, horas extra).",
      },
      {
        campo: "cuentas",
        etiqueta: "¿Necesita cuentas de usuario?",
        ayuda: "",
        tipo: "botones",
        opciones: ["No, es de uso libre", "Sí, con usuario y contraseña", "Sí, con Google", "Sí, con correo mágico"],
      },
      {
        campo: "roles",
        etiqueta: "Roles y permisos",
        ayuda: "Quién puede ver o hacer qué. Si todos pueden todo, dilo.",
        tipo: "parrafo",
        ejemplo: "Administrador configura sueldos; supervisor solo pasa lista.",
      },
      {
        campo: "almacenamiento",
        etiqueta: "¿Dónde se guardan los datos?",
        ayuda: "",
        tipo: "botones",
        opciones: ["Solo en el navegador", "Base de datos en la nube (Supabase)", "Archivo / hoja de cálculo", "No guarda datos"],
      },
      {
        campo: "integraciones",
        etiqueta: "Integraciones o APIs externas",
        ayuda: "Pagos, mapas, correo, WhatsApp, IA… Si ninguna, escribe \"Ninguna\".",
        tipo: "parrafo",
      },
      {
        campo: "exportaciones",
        etiqueta: "¿Exporta o imprime algo?",
        ayuda: "Excel, PDF, calendario .ics, imagen… Si no, escribe \"No\".",
        tipo: "texto",
      },
      {
        campo: "notificaciones",
        etiqueta: "¿Avisa algo al usuario?",
        ayuda: "Correos, recordatorios, alertas en pantalla. Si no, escribe \"No\".",
        tipo: "texto",
      },
    ],
  },
  {
    titulo: "Diseño",
    pregunta: "¿Cómo se ve y se siente?",
    campos: [
      {
        campo: "estilo",
        etiqueta: "Estilo visual",
        ayuda: "Describe la sensación: serio, juguetón, corporativo, natural… y de dónde viene la inspiración.",
        tipo: "parrafo",
        ejemplo: "Táctico y corporativo, azul marino y dorado, inspirado en el muelle de Veracruz.",
      },
      { campo: "colores", etiqueta: "Colores", ayuda: "Primario, secundario y fondo.", tipo: "colores" },
      {
        campo: "tipografia",
        etiqueta: "Tipografía",
        ayuda: "Si tienes alguna en mente. Si no, déjalo vacío.",
        tipo: "texto",
        opcional: true,
        ejemplo: "Montserrat para títulos, Inter para texto",
      },
      {
        campo: "referencias",
        etiqueta: "Referencias o inspiración",
        ayuda: "Apps, sitios o imágenes que te gusten (enlaces o nombres). Si no tienes, escribe \"Ninguna\".",
        tipo: "parrafo",
      },
      { campo: "idioma", etiqueta: "Idioma de la app", ayuda: "", tipo: "botones", opciones: ["Español", "Inglés", "Español e inglés"] },
      {
        campo: "dispositivo",
        etiqueta: "¿Dónde se usará más?",
        ayuda: "",
        tipo: "botones",
        opciones: ["Celular", "Computadora", "Ambos por igual"],
      },
      { campo: "modoOscuro", etiqueta: "Modo oscuro", ayuda: "", tipo: "botones", opciones: ["Sí", "No", "Que siga al sistema"] },
      {
        campo: "recursos",
        etiqueta: "Logo, fotos o imágenes que ya tengas",
        ayuda: "Descríbelos o pega enlaces. Si no hay, déjalo vacío.",
        tipo: "parrafo",
        opcional: true,
      },
    ],
  },
  {
    titulo: "Entrega",
    pregunta: "¿Con qué se construye y cómo sabrás que funcionó?",
    campos: [
      {
        campo: "stack",
        etiqueta: "Stack",
        ayuda: "Tecnologías. Ya viene tu combinación de siempre; cámbiala si esta app pide otra cosa.",
        tipo: "texto",
      },
      {
        campo: "metricaExito",
        etiqueta: "¿Cómo sabrás que funciona?",
        ayuda: "Una señal medible: usuarios, tiempo ahorrado, un cliente que la usa…",
        tipo: "parrafo",
        ejemplo: "La nómina de la quincena se cierra en 10 minutos en lugar de 2 horas.",
      },
      {
        campo: "restricciones",
        etiqueta: "Restricciones",
        ayuda: "Presupuesto, datos sensibles, leyes, tiempo. Si no hay, escribe \"Ninguna\".",
        tipo: "parrafo",
      },
      { campo: "fechaObjetivo", etiqueta: "Fecha objetivo", ayuda: "¿Para cuándo la quieres lista?", tipo: "fecha" },
      { campo: "repo", etiqueta: "Repositorio en GitHub", ayuda: "Si ya existe.", tipo: "url", opcional: true },
      { campo: "enVivo", etiqueta: "Enlace en vivo", ayuda: "Si ya está publicada.", tipo: "url", opcional: true },
      { campo: "notas", etiqueta: "Notas extra", ayuda: "Cualquier otra cosa que deba saberse.", tipo: "parrafo", opcional: true },
    ],
  },
];

export const BORRADOR_VACIO: Borrador = {
  nombre: "",
  resumen: "",
  estado: "Idea",
  stack: "Next.js · TypeScript · Tailwind CSS · Vercel",
  repo: "",
  enVivo: "",
  categoria: "",
  problema: "",
  usuarios: "",
  alternativas: "",
  diferenciador: "",
  funcionalidades: ["", "", ""],
  pantallas: [{ nombre: "", descripcion: "" }],
  flujo: "",
  fueraDeAlcance: "",
  datos: "",
  cuentas: "",
  roles: "",
  almacenamiento: "",
  integraciones: "",
  exportaciones: "",
  notificaciones: "",
  estilo: "",
  colores: { primario: "#E4572E", secundario: "#17BEBB", fondo: "#FFFBF2" },
  tipografia: "",
  referencias: "",
  idioma: "",
  dispositivo: "",
  modoOscuro: "",
  recursos: "",
  metricaExito: "",
  restricciones: "",
  fechaObjetivo: "",
  notas: "",
};

const URL_VALIDA = /^https?:\/\/\S+\.\S+/;

/** Devuelve un mensaje por cada campo que falta o está mal. Se usa igual en el navegador y en el servidor. */
export function validar(b: Borrador, campos: DefCampo[]): Partial<Record<Campo, string>> {
  const errores: Partial<Record<Campo, string>> = {};
  for (const def of campos) {
    const valor = b[def.campo];
    if (def.tipo === "lista") {
      const llenos = (valor as string[]).filter((t) => t.trim()).length;
      if (llenos < (def.minimo ?? 1)) errores[def.campo] = `Escribe al menos ${def.minimo ?? 1}.`;
    } else if (def.tipo === "pantallas") {
      const pantallas = valor as Borrador["pantallas"];
      const completas = pantallas.filter((p) => p.nombre.trim() && p.descripcion.trim()).length;
      const incompletas = pantallas.some((p) => Boolean(p.nombre.trim()) !== Boolean(p.descripcion.trim()));
      if (incompletas) errores[def.campo] = "Cada pantalla necesita nombre y descripción.";
      else if (completas < (def.minimo ?? 1)) errores[def.campo] = `Describe al menos ${def.minimo ?? 1} pantalla.`;
    } else if (def.tipo === "colores") {
      const c = valor as Borrador["colores"];
      if (![c.primario, c.secundario, c.fondo].every((x) => /^#[0-9a-f]{6}$/i.test(x))) errores[def.campo] = "Elige los tres colores.";
    } else {
      const texto = String(valor ?? "").trim();
      if (!texto) {
        if (!def.opcional) errores[def.campo] = "Este dato hace falta.";
      } else if (def.tipo === "url" && !URL_VALIDA.test(texto)) {
        errores[def.campo] = "Debe ser un enlace completo, con https://";
      } else if (def.opciones && !def.opciones.includes(texto)) {
        errores[def.campo] = "Elige una opción.";
      } else if (def.maxLargo && texto.length > def.maxLargo) {
        errores[def.campo] = `Máximo ${def.maxLargo} caracteres.`;
      } else if (def.tipo === "parrafo" && !def.opcional && texto.length < 4) {
        errores[def.campo] = "Cuéntame un poco más.";
      }
    }
  }
  return errores;
}

export const TODOS_LOS_CAMPOS = PASOS.flatMap((p) => p.campos);
