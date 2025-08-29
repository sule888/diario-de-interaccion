import type { Subject } from "../../types/subject";

type Props = {
  subject: Subject;
  onClose: () => void;
  onEdit?: (subject: Subject) => void;
};

export default function SubjectDetailsModal({
  subject,
  onClose,
  onEdit,
}: Props) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" className="modal">
        <header className="modal__header">
          <div className="modal__title">Detalle de sujeto</div>

          <div className="row-wrap" style={{ gap: 8 }}>
            {/* <-- BOTÓN EDITAR */}
            {onEdit && (
              <button
                className="btn btn--ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(subject);
                }}
                aria-label="Editar sujeto"
                title="Editar"
              >
                {/* ícono lápiz */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M14.06 6.19l3.75 3.75 1.69-1.69a1.5 1.5 0 0 0 0-2.12l-1.63-1.63a1.5 1.5 0 0 0-2.12 0l-1.69 1.69z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </button>
            )}

            <button
              className="btn btn--ghost"
              onClick={onClose}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </header>

        <div className="modal__body">
          <div className="col">
            <div>
              <strong>Nombre:</strong> {subject.nombre}
            </div>
            {subject.alias && (
              <div>
                <strong>Alias:</strong> {subject.alias}
              </div>
            )}
            {subject.relacion && (
              <div>
                <strong>Relación:</strong> {subject.relacion}
              </div>
            )}
            {subject.canalPrincipal && (
              <div>
                <strong>Canal principal:</strong> {subject.canalPrincipal}
              </div>
            )}
            {subject.confianza !== undefined && (
              <div>
                <strong>Confianza inicial:</strong> {subject.confianza}/5
              </div>
            )}
            {subject.etiquetas && subject.etiquetas.length > 0 && (
              <div>
                <strong>Etiquetas:</strong> {subject.etiquetas.join(", ")}
              </div>
            )}
            {subject.notaInicial && (
              <div>
                <strong>Nota inicial:</strong>
                <div className="p" style={{ marginTop: 6 }}>
                  {subject.notaInicial}
                </div>
              </div>
            )}
            <div className="muted">
              <strong>Creado:</strong>{" "}
              {new Date(subject.creadoEn).toLocaleString()}
            </div>
          </div>
        </div>

        <footer className="modal__footer">
          <button className="btn btn--primary" onClick={onClose}>
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}
