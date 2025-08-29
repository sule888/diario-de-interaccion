import type { Note } from "../../types/note";
import type { Subject } from "../../types/subject";

type Props = {
  notes: Note[];
  subjectsMap: Map<string, Subject>;
  onView: (note: Note) => void;
  onDelete: (id: string) => void;
};

function fmt(dIso: string) {
  try {
    const d = new Date(dIso);
    return d.toLocaleString();
  } catch {
    return dIso;
  }
}

export default function NotesTable({
  notes,
  subjectsMap,
  onView,
  onDelete,
}: Props) {
  if (notes.length === 0) {
    return <div className="muted">No hay notas todavía.</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-compact">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Sujeto</th>
            <th>Tema</th>
            <th>Tipo</th>
            <th>Canal</th>
            <th>Calif.</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {notes.map((n) => {
            const s = subjectsMap.get(n.subjectId);
            return (
              <tr key={n.id}>
                <td>{fmt(n.timestamp)}</td>
                <td>{s ? s.nombre : n.subjectId}</td>
                <td>{n.temaPrincipal || "—"}</td>
                <td>{n.tipo || "—"}</td>
                <td>{n.canal || "—"}</td>
                <td>{n.calificacionGeneral ?? "—"}</td>
                <td
                  className="row-wrap"
                  style={{ gap: 8, justifyContent: "end" }}
                >
                  <button className="btn btn--ghost" onClick={() => onView(n)}>
                    Ver
                  </button>
                  <button
                    className="btn btn--danger"
                    onClick={() => onDelete(n.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
