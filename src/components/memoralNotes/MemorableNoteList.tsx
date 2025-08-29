import type { Note } from "../../types/note";
import type { Subject } from "../../types/subject";

type Props = {
  notes: Note[];
  subjectsMap: Map<string, Subject>;
  onSelect: (note: Note) => void;
};

function fmtDate(dIso: string) {
  try {
    const d = new Date(dIso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return dIso;
  }
}

export default function MemorableNotesList({
  notes,
  subjectsMap,
  onSelect,
}: Props) {
  if (!notes.length) {
    return <div className="muted">No hay momentos memorables.</div>;
  }

  return (
    <ol
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "grid",
        gap: 10,
      }}
    >
      {notes.map((n) => {
        const s = subjectsMap.get(n.subjectId);
        const title = n.temaPrincipal?.trim() || "Sin título";
        return (
          <li
            key={n.id}
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 12,
              alignItems: "start",
            }}
          >
            <div
              style={{
                display: "grid",
                justifyItems: "center",
                gap: 6,
                width: 48,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "var(--accent, #6b73ff)",
                  marginTop: 6,
                }}
              />
              <div
                style={{
                  width: 2,
                  background: "var(--surface-2, #e6e6e6)",
                  flex: 1,
                  minHeight: 24,
                }}
              />
            </div>

            <button
              className="btn btn--ghost"
              style={{
                textAlign: "left",
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--surface-2, #e6e6e6)",
                borderRadius: 8,
              }}
              onClick={() => onSelect(n)}
              aria-label={`Abrir nota memorable ${title}`}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 8,
                  alignItems: "baseline",
                }}
              >
                <time className="muted" style={{ fontSize: 12 }}>
                  {fmtDate(n.timestamp)}
                </time>
                <div
                  style={{
                    display: "grid",
                    gap: 2,
                  }}
                >
                  <div style={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {title}
                  </div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {s ? s.nombre : n.subjectId}
                  </div>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
