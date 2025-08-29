// components/subject/EditSubjectModal.tsx
import { useEffect, useId, useRef, useState } from "react";
import type { Subject, Relationship, MainChannel } from "../../types/subject";

type Props = {
  subject: Subject;
  onClose: () => void;
  onSubmit: (patch: Partial<Subject>) => void;
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

export default function EditSubjectModal({
  subject,
  onClose,
  onSubmit,
}: Props) {
  const nombreId = useId();
  const aliasId = useId();
  const relId = useId();
  const canalId = useId();

  const dialogRef = useRef<HTMLDivElement>(null);

  const [nombre, setNombre] = useState(subject.nombre);
  const [alias, setAlias] = useState(subject.alias || "");
  const [relacion, setRelacion] = useState<Relationship | "">(
    (subject.relacion as Relationship) || ""
  );
  const [canalPrincipal, setCanalPrincipal] = useState<MainChannel | "">(
    (subject.canalPrincipal as MainChannel) || ""
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onBackdrop = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) onClose();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const patch: Partial<Subject> = {
      nombre: nombre.trim(),
      alias: alias.trim() || undefined,
      relacion: (relacion || undefined) as Subject["relacion"],
      canalPrincipal: (canalPrincipal ||
        undefined) as Subject["canalPrincipal"],
    };
    onSubmit(patch);
  };

  const isValid = nombre.trim().length > 0;

  return (
    <div className="modal-backdrop" ref={dialogRef} onMouseDown={onBackdrop}>
      <div
        role="dialog"
        aria-modal="true"
        className="modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <div className="modal__title">Editar sujeto</div>
          <button
            className="btn btn--ghost"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </header>

        <form className="modal__body" onSubmit={submit}>
          <div className="field">
            <label htmlFor={nombreId} className="label">
              Nombre *
            </label>
            <input
              id={nombreId}
              className="input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor={aliasId} className="label">
              Alias
            </label>
            <input
              id={aliasId}
              className="input"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Opcional"
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
              onChange={(e) => setRelacion(e.target.value as Relationship | "")}
            >
              <option value="">— Selecciona —</option>
              {RELACIONES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor={canalId} className="label">
              Canal principal
            </label>
            <select
              id={canalId}
              className="select"
              value={canalPrincipal}
              onChange={(e) =>
                setCanalPrincipal(e.target.value as MainChannel | "")
              }
            >
              <option value="">— Selecciona —</option>
              {CANALES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
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
              Guardar cambios
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
