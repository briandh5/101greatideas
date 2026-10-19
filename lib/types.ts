export const ESTADOS = ["Idea", "En construcción", "Publicada", "En pausa"] as const;
export type Estado = (typeof ESTADOS)[number];

export const CATEGORIAS = [
  "Productividad",
  "Educación",
  "Salud y bienestar",
  "Familia",
  "Finanzas",
  "Negocio / empresa",
  "Social / comunidad",
  "Juego / entretenimiento",
  "Herramienta para desarrolladores",
  "Otra",
] as const;

export interface Pantalla {
  nombre: string;
  descripcion: string;
}

/** Todo lo que el formulario de "Nueva idea" pide para describir una app sin huecos. */
export interface Detalle {
  categoria: string;
  // Problema
  problema: string;
  usuarios: string;
  alternativas: string;
  diferenciador: string;
  // Funcionalidad
  funcionalidades: string[];
  pantallas: Pantalla[];
  flujo: string;
  fueraDeAlcance: string;
  // Datos y cuentas
  datos: string;
  cuentas: string;
  roles: string;
  almacenamiento: string;
  integraciones: string;
  exportaciones: string;
  notificaciones: string;
  // Diseño
  estilo: string;
  colores: { primario: string; secundario: string; fondo: string };
  tipografia: string;
  referencias: string;
  idioma: string;
  dispositivo: string;
  modoOscuro: string;
  recursos: string;
  // Técnico y entrega
  metricaExito: string;
  restricciones: string;
  fechaObjetivo: string;
  notas: string;
}

export interface Idea {
  numero: number;
  nombre: string;
  resumen: string;
  stack: string;
  repo: string;
  enVivo: string;
  estado: Estado;
  creada: string; // AAAA-MM-DD
  detalle?: Detalle;
}
