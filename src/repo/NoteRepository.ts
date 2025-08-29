import type { Note } from "../types/note";

export interface NoteRepository {
  list(): Note[];
  listBySubject(subjectId: string): Note[];
  get(id: string): Note | null;
  create(n: Note): Note;
  update(id: string, patch: Partial<Note>): Note | null;
  remove(id: string): void;
  clear(): void;
}

const INDEX_ALL = "notes:index";
const INDEX_BY_SUBJECT = (sid: string) => `notes:bySubject:${sid}`;
const NOTE_KEY = (id: string) => `note:${id}`;

function readJson<T>(k: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(k) || "") as T;
  } catch {
    return fallback;
  }
}
function writeJson<T>(k: string, v: T) {
  localStorage.setItem(k, JSON.stringify(v));
}

export class LocalNoteRepository implements NoteRepository {
  list(): Note[] {
    const ids = readJson<string[]>(INDEX_ALL, []);
    return ids.map((id) => this.get(id)).filter(Boolean) as Note[];
  }

  listBySubject(subjectId: string): Note[] {
    const ids = readJson<string[]>(INDEX_BY_SUBJECT(subjectId), []);
    return ids.map((id) => this.get(id)).filter(Boolean) as Note[];
  }

  get(id: string): Note | null {
    const raw = localStorage.getItem(NOTE_KEY(id));
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Note;
    } catch {
      return null;
    }
  }

  create(n: Note): Note {
    const all = readJson<string[]>(INDEX_ALL, []);
    if (!all.includes(n.id)) {
      all.unshift(n.id);
      writeJson(INDEX_ALL, all);
    }
    const byS = readJson<string[]>(INDEX_BY_SUBJECT(n.subjectId), []);
    if (!byS.includes(n.id)) {
      byS.unshift(n.id);
      writeJson(INDEX_BY_SUBJECT(n.subjectId), byS);
    }
    writeJson(NOTE_KEY(n.id), n);
    return n;
  }

  update(id: string, patch: Partial<Note>): Note | null {
    const cur = this.get(id);
    if (!cur) return null;
    const next = { ...cur, ...patch };
    writeJson(NOTE_KEY(id), next);
    return next;
  }

  remove(id: string): void {
    const cur = this.get(id);
    if (!cur) return;
    const all = readJson<string[]>(INDEX_ALL, []).filter((x) => x !== id);
    writeJson(INDEX_ALL, all);

    const byS = readJson<string[]>(INDEX_BY_SUBJECT(cur.subjectId), []).filter(
      (x) => x !== id
    );
    writeJson(INDEX_BY_SUBJECT(cur.subjectId), byS);

    localStorage.removeItem(NOTE_KEY(id));
  }

  clear(): void {
    const all = readJson<string[]>(INDEX_ALL, []);
    all.forEach((id) => localStorage.removeItem(NOTE_KEY(id)));
    writeJson(INDEX_ALL, []);
  }
}
