import type { MainChannel } from "./subject";

export type NoteTipo =
  | "escolar"
  | "laboral"
  | "familiar"
  | "amigos"
  | "casual"
  | "otro";
export type Sentiment = "negativo" | "neutral" | "positivo";

export interface Note {
  id: string;
  subjectId: string;
  timestamp: string;
  canal?: MainChannel;
  tipo?: NoteTipo;

  calificacionGeneral?: number;

  temaPrincipal?: string;
  contenido: string;

  puntosPositivos?: string[];
  puntosNegativos?: string[];
  puntosPorMejorar?: string[];

  escalaEmpatia?: number;
  escalaReceptividad?: number;
  escalaAtencion?: number;
  escalaEscuchaActiva?: number;
  escalaComentariosAcertados?: number;

  otrosAspectos?: string;
  cambiosDeTema?: string;

  esMemorable?: boolean;

  sentimiento?: Sentiment;

  etiquetas?: string[];
}
