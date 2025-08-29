import type { Note } from "../../types/note";
import type { Subject } from "../../types/subject";

type Props = {
  note: Note;
  subject: Subject | null;
  onClose: () => void;
  onDelete?: () => void;
};

function fmt(dIso: string) {
  try {
    const d = new Date(dIso);
    return d.toLocaleString();
  } catch {
    return dIso;
  }
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        background: "var(--surface-2, #f0f0f0)",
        fontSize: 12,
        marginRight: 6,
        marginBottom: 6,
      }}
    >
      {children}
    </span>
  );
}

export default function NoteDetailsModal({
  note,
  subject,
  onClose,
  onDelete,
}: Props) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.currentTarget === e.target && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <div className="modal__title">
            Nota de {subject ? subject.nombre : "Sujeto desconocido"}
          </div>
          <button
            className="btn btn--ghost"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </header>

        <div className="modal__body" style={{ display: "grid", gap: 12 }}>
          <div className="muted" style={{ marginBottom: 8 }}>
            <strong>Fecha:</strong> {fmt(note.timestamp)}
          </div>

          <div className="row-wrap" style={{ gap: 8, flexWrap: "wrap" }}>
            {note.tipo && <Pill>Tipo: {note.tipo}</Pill>}
            {note.canal && <Pill>Canal: {note.canal}</Pill>}
            {typeof note.calificacionGeneral === "number" && (
              <Pill>Calificación: {note.calificacionGeneral}/5</Pill>
            )}
            {note.esMemorable && <Pill>⭐ Memorable</Pill>}
          </div>

          {note.temaPrincipal && (
            <div>
              <div className="label">Tema principal</div>
              <div>{note.temaPrincipal}</div>
            </div>
          )}

          <div>
            <div className="label">Descripción / resumen</div>
            <div style={{ whiteSpace: "pre-wrap" }}>{note.contenido}</div>
          </div>

          {(note.puntosPositivos?.length ||
            note.puntosNegativos?.length ||
            note.puntosPorMejorar?.length) && (
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              {note.puntosPositivos?.length ? (
                <div>
                  <div className="label">Lo positivo</div>
                  <ul className="list">
                    {note.puntosPositivos.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {note.puntosNegativos?.length ? (
                <div>
                  <div className="label">Lo negativo</div>
                  <ul className="list">
                    {note.puntosNegativos.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {note.puntosPorMejorar?.length ? (
                <div>
                  <div className="label">Por mejorar</div>
                  <ul className="list">
                    {note.puntosPorMejorar.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}

          {(note.escalaEmpatia ||
            note.escalaReceptividad ||
            note.escalaAtencion ||
            note.escalaEscuchaActiva ||
            note.escalaComentariosAcertados) && (
            <div
              style={{
                display: "grid",
                gap: 8,
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              {typeof note.escalaEmpatia === "number" && (
                <div>Empatía: {note.escalaEmpatia}/5</div>
              )}
              {typeof note.escalaReceptividad === "number" && (
                <div>Receptividad: {note.escalaReceptividad}/5</div>
              )}
              {typeof note.escalaAtencion === "number" && (
                <div>Atención: {note.escalaAtencion}/5</div>
              )}
              {typeof note.escalaEscuchaActiva === "number" && (
                <div>Escucha activa: {note.escalaEscuchaActiva}/5</div>
              )}
              {typeof note.escalaComentariosAcertados === "number" && (
                <div>
                  Comentarios acertados: {note.escalaComentariosAcertados}/5
                </div>
              )}
            </div>
          )}

          {note.otrosAspectos && (
            <div>
              <div className="label">Otros aspectos</div>
              <div style={{ whiteSpace: "pre-wrap" }}>{note.otrosAspectos}</div>
            </div>
          )}

          {note.cambiosDeTema && (
            <div>
              <div className="label">Cambios de tema</div>
              <div style={{ whiteSpace: "pre-wrap" }}>{note.cambiosDeTema}</div>
            </div>
          )}

          {note.etiquetas?.length ? (
            <div>
              <div className="label">Etiquetas</div>
              <div className="row-wrap" style={{ gap: 6, flexWrap: "wrap" }}>
                {note.etiquetas.map((t, i) => (
                  <Pill key={i}>{t}</Pill>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <footer className="modal__footer">
          {onDelete && (
            <button className="btn btn--danger" onClick={onDelete}>
              Eliminar
            </button>
          )}
          <button className="btn btn--ghost" onClick={onClose}>
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}
