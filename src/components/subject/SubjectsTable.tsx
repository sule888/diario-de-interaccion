import styles from "./SubjectsTable.module.css";
import type { Subject } from "../../types/subject";

type Props = {
  subjects: Subject[];
  onRowClick: (subject: Subject) => void;
  onDelete: (id: string) => void;
  onEdit: (subject: Subject) => void;
};

export default function SubjectsTable({
  subjects,
  onRowClick,
  onDelete,
  onEdit,
}: Props) {
  return (
    <div className="card">
      <h2 className="h2" style={{ marginBottom: 8 }}>
        Sujetos de interacción
      </h2>
      <div className={styles.tableWrap}>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Alias</th>
              <th>Relación</th>
              <th>Canal principal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  Sin sujetos aún.
                </td>
              </tr>
            ) : (
              subjects.map((subject) => (
                <tr
                  key={subject.id}
                  className={styles.row}
                  onClick={() => onRowClick(subject)}
                >
                  <td>{subject.nombre}</td>
                  <td>
                    {subject.alias ? (
                      subject.alias
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>
                    {subject.relacion ? (
                      subject.relacion
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>
                    {subject.canalPrincipal ? (
                      subject.canalPrincipal
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td className={styles.actions}>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      title="Editar"
                      aria-label="Editar"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(subject);
                      }}
                    >
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

                    <button
                      type="button"
                      className={`${styles.iconBtn} ${styles.danger}`}
                      title="Eliminar"
                      aria-label="Eliminar"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(subject.id);
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 7h16"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                        />
                        <path
                          d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
