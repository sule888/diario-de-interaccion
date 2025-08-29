import { useEffect, useId, useMemo, useRef, useState } from "react";
import styles from "./CreateSubjectModal.module.css";
import type { Subject, Relationship, MainChannel } from "../../types/subject";

type Props = {
  onClose: () => void;
  onCreate: (subject: Subject) => void;
};

const RELACIONES: Relationship[] = [
  "amigo",
  "familia",
  "pareja",
  "cliente",
  "colega",
  "otro",
];

const CANALES: MainChannel[] = [
  "presencial",
  "chat",
  "llamada",
  "email",
  "red_social",
];

export default function CreateSubjectModal({ onClose, onCreate }: Props) {
  const nameId = useId();
  const aliasId = useId();
  const relId = useId();
  const canalId = useId();
  const notaId = useId();
  const confId = useId();
  const tagsId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  // variables reactivas de cada ingreso de info del usuario
  const [nombre, setNombre] = useState("");
  const [alias, setAlias] = useState("");
  const [relacion, setRelacion] = useState<Relationship | "">("");
  const [canal, setCanal] = useState<MainChannel | "">("");
  const [notaInicial, setNotaInicial] = useState("");
  const [confianza, setConfianza] = useState<number>(3);
  const [etiquetas, setEtiquetas] = useState<string>("");
  //funcion para manejar la salida del modl en la tecla esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isValid = useMemo(() => nombre.trim().length > 0, [nombre]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const subject: Subject = {
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      alias: alias.trim() || undefined,
      relacion: (relacion || undefined) as Subject["relacion"],
      canalPrincipal: (canal || undefined) as Subject["canalPrincipal"],
      notaInicial: notaInicial.trim() || undefined,
      confianza,
      etiquetas: etiquetas
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      creadoEn: new Date().toISOString(),
    };
    onCreate(subject);
  };

  const onBackdrop = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) onClose();
  };

  return (
    <div className="modal-backdrop" ref={dialogRef} onMouseDown={onBackdrop}>
      <div role="dialog" aria-modal="true" className="modal">
        <header className="modal__header">
          <div className="modal__title">Nuevo sujeto de interacción</div>
          <button
            className="btn btn--ghost"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </header>

        <form className="modal__body" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor={nameId} className="label">
              Nombre
            </label>
            <input
              id={nameId}
              className="input"
              placeholder="Ej. Ana Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <span className="help">Obligatorio</span>
          </div>

          <div className={styles.grid}>
            <div className="field">
              <label htmlFor={aliasId} className="label">
                Alias / Apodo
              </label>
              <input
                id={aliasId}
                className="input"
                placeholder="Ej. Ana P."
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor={relId} className="label">
                Relación
              </label>
              <select
                id={relId}
                className="select"
                value={relacion}
                onChange={(e) =>
                  setRelacion(e.target.value as Relationship | "")
                }
              >
                <option value="">— Selecciona —</option>
                {RELACIONES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.grid}>
            <div className="field">
              <label htmlFor={canalId} className="label">
                Canal principal
              </label>
              <select
                id={canalId}
                className="select"
                value={canal}
                onChange={(e) => setCanal(e.target.value as MainChannel | "")}
              >
                <option value="">— Selecciona —</option>
                {CANALES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <span className="help">Cómo interactúan usualmente</span>
            </div>

            <div className="field">
              <label htmlFor={confId} className="label">
                Confianza inicial (1–5)
              </label>
              <input
                id={confId}
                className="input"
                type="number"
                min={1}
                max={5}
                value={confianza}
                onChange={(e) => setConfianza(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor={tagsId} className="label">
              Etiquetas (separadas por coma)
            </label>
            <input
              id={tagsId}
              className="input"
              placeholder="trabajo, escuela"
              value={etiquetas}
              onChange={(e) => setEtiquetas(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor={notaId} className="label">
              Nota inicial
            </label>
            <textarea
              id={notaId}
              className="textarea"
              rows={3}
              placeholder="Observaciones breves para arrancar el perfil…"
              value={notaInicial}
              onChange={(e) => setNotaInicial(e.target.value)}
            />
          </div>

          <footer className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={!isValid}
            >
              Crear sujeto
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
