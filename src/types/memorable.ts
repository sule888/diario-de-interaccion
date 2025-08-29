// types/memorable.ts
import type { Note } from "./note";

export type MemorablePreview = Pick<
  Note,
  "id" | "timestamp" | "temaPrincipal" | "subjectId"
>;
