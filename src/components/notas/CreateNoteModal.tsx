import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Note, NoteTipo } from "../../types/note";
import type { Subject, MainChannel } from "../../types/subject";
import styles from "./CreateNoteModal.module.css";

type Props = {
  subjects: Subject[];
  onClose: () => void;
  onCreate: (note: Note) => void;
  initialSubjectId?: string;
};

const TIPOS: NoteTipo[] = [
  "escolar",
  "laboral",
  "familiar",
  "amigos",
  "casual",
  "otro",
];

function toLocalDatetimeValue(d = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const dt = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(
    dt.getDate()
  )}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

function parseList(value: string): string[] {
  return value
    .split(/\n|,/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function CreateNoteModal({
  subjects,
  onClose,
  onCreate,
  initialSubjectId,
}: Props) {
  const subjId = useId();
  const tsId = useId();
  const chId = useId();
  const tipoId = useId();
  const califId = useId();

  const temaId = useId();
  const textoId = useId();

  const posId = useId();
  const negId = useId();
  const mejId = useId();

  const empId = useId();
  const recId = useId();
  const ateId = useId();
  const escId = useId();
  const comId = useId();

  const otrosId = useId();
  const cambId = useId();
  const memId = useId();
  const tagsId = useId();

  const dialogRef = useRef<HTMLDivElement>(null);

  const [subjectId, setSubjectId] = useState<string>(initialSubjectId || "");
  const [timestamp, setTimestamp] = useState<string>(toLocalDatetimeValue());
  const [canal, setCanal] = useState<MainChannel | "">("");
  const [tipo, setTipo] = useState<NoteTipo | "">("");

  const [calificacionGeneral, setCalificacionGeneral] = useState<number>(3);

  const [temaPrincipal, setTemaPrincipal] = useState("");
  const [contenido, setContenido] = useState("");

  const [pPositivos, setPPositivos] = useState("");
  const [pNegativos, setPNegativos] = useState("");
  const [pMejorar, setPMejorar] = useState("");

  const [escEmpatia, setEscEmpatia] = useState<number>(3);
  const [escReceptividad, setEscReceptividad] = useState<number>(3);
  const [escAtencion, setEscAtencion] = useState<number>(3);
  const [escEscucha, setEscEscucha] = useState<number>(3);
  const [escComentarios, setEscComentarios] = useState<number>(3);

  const [otrosAspectos, setOtrosAspectos] = useState("");
  const [cambiosDeTema, setCambiosDeTema] = useState("");
  const [esMemorable, setEsMemorable] = useState(false);

  const [etiquetas, setEtiquetas] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const s = subjects.find((x) => x.id === subjectId);
    if (s && !canal && s.canalPrincipal) setCanal(s.canalPrincipal);
  }, [subjectId, subjects, canal]);

  const isValid = useMemo(
    () => subjectId.trim() && contenido.trim(),
    [subjectId, contenido]
  );

  const toISO = (localValue: string) => {
    const d = new Date(localValue);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const note: Note = {
      id: crypto.randomUUID(),
      subjectId,
      timestamp: toISO(timestamp),
      canal: (canal || undefined) as Note["canal"],
      tipo: (tipo || undefined) as Note["tipo"],

      calificacionGeneral,

      temaPrincipal: temaPrincipal.trim() || undefined,
      contenido: contenido.trim(),

      puntosPositivos: parseList(pPositivos),
      puntosNegativos: parseList(pNegativos),
      puntosPorMejorar: parseList(pMejorar),

      escalaEmpatia: escEmpatia,
      escalaReceptividad: escReceptividad,
      escalaAtencion: escAtencion,
      escalaEscuchaActiva: escEscucha,
      escalaComentariosAcertados: escComentarios,

      otrosAspectos: otrosAspectos.trim() || undefined,
      cambiosDeTema: cambiosDeTema.trim() || undefined,
      esMemorable,

      etiquetas: parseList(etiquetas),
    };

    onCreate(note);
  };

  const onBackdrop = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) onClose();
  };

  return (
    <div className="modal-backdrop" ref={dialogRef} onMouseDown={onBackdrop}>
      <div role="dialog" aria-modal="true" className="modal">
        <header className="modal__header">
          <div className="modal__title">Nueva nota de interacción</div>
          <button
            className="btn btn--ghost"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </header>

        <form className="modal__body" onSubmit={submit}>
          <div className={styles.grid2}>
            <div className="field">
              <label htmlFor={subjId} className="label">
                Sujeto *
              </label>
              <select
                id={subjId}
                className="select"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                required
              >
                <option value="">— Selecciona —</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                    {s.alias ? ` (${s.alias})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor={tsId} className="label">
                Fecha y hora *
              </label>
              <input
                id={tsId}
                type="datetime-local"
                className="input"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.grid3}>
            <div className="field">
              <label htmlFor={chId} className="label">
                Canal
              </label>
              <select
                id={chId}
                className="select"
                value={canal}
                onChange={(e) => setCanal(e.target.value as MainChannel | "")}
              >
                <option value="">— Selecciona —</option>
                <option value="presencial">presencial</option>
                <option value="chat">chat</option>
                <option value="llamada">llamada</option>
                <option value="email">email</option>
                <option value="red_social">red_social</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor={tipoId} className="label">
                Tipo de interacción
              </label>
              <select
                id={tipoId}
                className="select"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as NoteTipo | "")}
              >
                <option value="">— Selecciona —</option>
                {TIPOS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor={califId} className="label">
                Calificación general (1–5)
              </label>
              <input
                id={califId}
                className="input"
                type="number"
                min={1}
                max={5}
                value={calificacionGeneral}
                onChange={(e) => setCalificacionGeneral(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor={temaId} className="label">
              Tema principal
            </label>
            <input
              id={temaId}
              className="input"
              placeholder="Ej. seguimiento de proyecto"
              value={temaPrincipal}
              onChange={(e) => setTemaPrincipal(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor={textoId} className="label">
              Descripción / resumen *
            </label>
            <textarea
              id={textoId}
              className="textarea"
              rows={5}
              placeholder="Detalles de la conversación, acuerdos, percepciones…"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              required
            />
          </div>

          <div className={styles.grid3}>
            <div className="field">
              <label htmlFor={posId} className="label">
                Lo positivo
              </label>
              <textarea
                id={posId}
                className="textarea"
                rows={3}
                placeholder="Un punto por línea o separados por comas"
                value={pPositivos}
                onChange={(e) => setPPositivos(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor={negId} className="label">
                Lo negativo
              </label>
              <textarea
                id={negId}
                className="textarea"
                rows={3}
                placeholder="Un punto por línea o separados por comas"
                value={pNegativos}
                onChange={(e) => setPNegativos(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor={mejId} className="label">
                Por mejorar
              </label>
              <textarea
                id={mejId}
                className="textarea"
                rows={3}
                placeholder="Un punto por línea o separados por comas"
                value={pMejorar}
                onChange={(e) => setPMejorar(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.scales}>
            <div className={styles.scaleItem}>
              <label htmlFor={empId} className="label">
                Empatía: {escEmpatia}
              </label>
              <input
                id={empId}
                type="range"
                min={1}
                max={5}
                value={escEmpatia}
                onChange={(e) => setEscEmpatia(Number(e.target.value))}
              />
            </div>
            <div className={styles.scaleItem}>
              <label htmlFor={recId} className="label">
                Receptividad: {escReceptividad}
              </label>
              <input
                id={recId}
                type="range"
                min={1}
                max={5}
                value={escReceptividad}
                onChange={(e) => setEscReceptividad(Number(e.target.value))}
              />
            </div>
            <div className={styles.scaleItem}>
              <label htmlFor={ateId} className="label">
                Atención: {escAtencion}
              </label>
              <input
                id={ateId}
                type="range"
                min={1}
                max={5}
                value={escAtencion}
                onChange={(e) => setEscAtencion(Number(e.target.value))}
              />
            </div>
            <div className={styles.scaleItem}>
              <label htmlFor={escId} className="label">
                Escucha activa: {escEscucha}
              </label>
              <input
                id={escId}
                type="range"
                min={1}
                max={5}
                value={escEscucha}
                onChange={(e) => setEscEscucha(Number(e.target.value))}
              />
            </div>
            <div className={styles.scaleItem}>
              <label htmlFor={comId} className="label">
                Comentarios acertados: {escComentarios}
              </label>
              <input
                id={comId}
                type="range"
                min={1}
                max={5}
                value={escComentarios}
                onChange={(e) => setEscComentarios(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor={otrosId} className="label">
              Otros aspectos
            </label>
            <textarea
              id={otrosId}
              className="textarea"
              rows={3}
              placeholder="Cualquier detalle adicional que quieras registrar"
              value={otrosAspectos}
              onChange={(e) => setOtrosAspectos(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor={cambId} className="label">
              Cambios de tema
            </label>
            <textarea
              id={cambId}
              className="textarea"
              rows={3}
              placeholder="Momentos en los que cambiaste de tema (opcional)"
              value={cambiosDeTema}
              onChange={(e) => setCambiosDeTema(e.target.value)}
            />
          </div>

          <div className={styles.grid2}>
            <div className="field">
              <label htmlFor={tagsId} className="label">
                Etiquetas
              </label>
              <input
                id={tagsId}
                className="input"
                placeholder="feedback, negociación"
                value={etiquetas}
                onChange={(e) => setEtiquetas(e.target.value)}
              />
              <span className="help">
                Separadas por comas o saltos de línea
              </span>
            </div>

            <div className="field" style={{ alignSelf: "end" }}>
              <label className="label" htmlFor={memId}>
                Marcar como momento memorable
              </label>
              <input
                id={memId}
                type="checkbox"
                checked={esMemorable}
                onChange={(e) => setEsMemorable(e.target.checked)}
              />
            </div>
          </div>

          <footer className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn--success"
              disabled={!isValid}
            >
              Guardar nota
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
