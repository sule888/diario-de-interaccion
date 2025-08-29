import type { Subject } from "../types/subject";

// ! Funciones de local storage:
// localStorage.getItem(clave): string | null → lee el valor (string) o null si no existe.
// localStorage.setItem(clave, valorString): void → guarda un string.
// localStorage.removeItem(clave): void → elimina una clave.
// localStorage.clear(): void → borra todo.
// localStorage.key(index): string | null → devuelve la clave en esa posición.

export interface SubjectRepository {
  list(): Subject[];
  get(id: string): Subject | null;
  create(s: Subject): Subject;
  update(id: string, s: Partial<Subject>): Subject | null;
  remove(id: string): void;
  clear(): void;
}
//Es el array donde se guardan mis sujetos, es el array de objetos (sujetos) que se muestra en mi tabla
const INDEX_KEY = "subjects:index"; // ["id1","id2",...]
const SUBJECT_KEY = (id: string) => `subject:${id}`; // JSON por sujeto, es la clave que le dare
// a cada funcion del crud, es una llave personal de este componente que representa a mi sujeto.
//Aqui la establecimos con su tipo y la forma en la que se guarda -> `subject:${id}`

// funcion para saber que objetos sujetos hay en local storage, devuelve todo el objeto.
function readIndex(): string[] {
  try {
    //retorna un ojeto con los objetos sujetos guardados en local storage
    return JSON.parse(localStorage.getItem(INDEX_KEY) || "[]");
  } catch {
    // para evitar que si algun sujeto de INDEX_KEY estuviera corrupto solo mande [] en vez de romperse
    return [];
  }
}
//funcion para catualizar el arreglode sujetos, escribimos sujetos en el array
// convierte el arreglo de sujetos a string y lo guarda en INDEX_KEY
// introduce un arreglo por que las funcoines de abajo estan constantenmente cambiando la copia de local storage
// con esta funcion se persisten los datos de local storage
function writeIndex(ids: string[]) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(ids));
}

// creamos la plantilla de la funicno global de repositorio para almacenamiento local llamado LocalSubjectRepository quye
// implementa la interfaz SubjectRepository doned definimos los principales metodos por asi decirlo
export class LocalSubjectRepository implements SubjectRepository {
  // funcioon que enlista mi array de sujetos
  list(): Subject[] {
    const ids = readIndex();
    return ids.map((id) => this.get(id)).filter(Boolean) as Subject[];
  }

  get(id: string): Subject | null {
    // obtiene el id del sijeto que queremos buscar en raw, buscandolo en local stoorage con su fuincion nativa
    // getItem pasandolo por la clave del sujeto
    const raw = localStorage.getItem(SUBJECT_KEY(id));
    // si no lo encuentra devuelve nulo
    if (!raw) return null;
    // si si lo encuentra lo parsea de string, que es como viene de local storage a un objeto de tipo sujeto
    try {
      return JSON.parse(raw) as Subject;
    } catch {
      // si viene corrupto devuelve nulo
      return null;
    }
  }

  create(s: Subject): Subject {
    // obtenemos el objeto de sujetos
    const ids = readIndex();
    // si no existe el id entrando en la funiocn lo agrega al inicio y oersiste el indice, es decir hace que los datos de ids y local storage sean los mismos

    if (!ids.includes(s.id)) {
      ids.unshift(s.id); // agrega al array de indices ids más reciente primero
      writeIndex(ids);
    }
    localStorage.setItem(SUBJECT_KEY(s.id), JSON.stringify(s));
    return s;
  }

  update(id: string, patch: Partial<Subject>): Subject | null {
    const cur = this.get(id);
    if (!cur) return null;
    // ! spread
    const next: Subject = { ...cur, ...patch };
    localStorage.setItem(SUBJECT_KEY(id), JSON.stringify(next));
    return next;
  }

  remove(id: string) {
    const ids = readIndex().filter((x) => x !== id);
    writeIndex(ids);
    localStorage.removeItem(SUBJECT_KEY(id));
  }

  clear() {
    const ids = readIndex();
    ids.forEach((id) => localStorage.removeItem(SUBJECT_KEY(id))); // borra todos los ids de localstorage
    writeIndex([]); // enviamos como
  }
}
