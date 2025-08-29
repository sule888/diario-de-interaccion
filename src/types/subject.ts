// Lista de posibles tipos para eleccion, es como el objeto del que puedo elegir items
export type Relationship =
  | "amigo"
  | "familia"
  | "pareja"
  | "cliente"
  | "colega"
  | "otro";

export type MainChannel =
  | "presencial"
  | "chat"
  | "llamada"
  | "email"
  | "red_social";

export interface Subject {
  id: string;
  nombre: string;
  alias?: string;
  relacion?: Relationship;
  canalPrincipal?: MainChannel;
  notaInicial?: string;
  confianza?: number;
  etiquetas?: string[];
  creadoEn: string;
  //! Futura informacion del sujeto :
}
