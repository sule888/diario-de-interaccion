import { useEffect, useMemo, useState } from "react";
import AddSubjectButton from "./components/subject/AddSubjectButton";
import CreateSubjectModal from "./components/subject/CreateSubjectModal";
import SubjectsTable from "./components/subject/SubjectsTable";
import SubjectDetailsModal from "./components/subject/SubjectDetailsModal";
import AddNoteButton from "./components/notas/AddNoteButton";
import CreateNoteModal from "./components/notas/CreateNoteModal";
import NotesTable from "./components/notas/NotesTable";
import NoteDetailsModal from "./components/notas/NoteDetailsModal";
import MemorableNotesList from "./components/memoralNotes/MemorableNoteList";
import EditSubjectModal from "./components/subject/EditSubjectModal";

import { LocalSubjectRepository } from "./repo/SubjectRepository";
import { LocalNoteRepository } from "./repo/NoteRepository";
import type { Subject } from "./types/subject";
import type { Note } from "./types/note";

export default function App() {
  const repo = useMemo(() => new LocalSubjectRepository(), []);
  const noteRepo = useMemo(() => new LocalNoteRepository(), []);

  const [isCreateOpen, setIsCreateSubjectOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selected, setSelectedSubject] = useState<Subject | null>(null);

  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [isEditSubjectOpen, setIsEditSubjectOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  // NOTAS
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  // cargar sujetos
  useEffect(() => {
    setSubjects(repo.list());
  }, [repo]);

  // cargar notas: si hay sujeto seleccionado -> por sujeto; si no, todas
  useEffect(() => {
    if (selected?.id) {
      setNotes(noteRepo.listBySubject(selected.id));
    } else {
      setNotes(noteRepo.list());
    }
  }, [noteRepo, selected]);

  // ! SUJETOS
  const handleCreateSubject = (data: Subject) => {
    repo.create(data);
    setSubjects((prev) => [data, ...prev]);
    setIsCreateSubjectOpen(false);
  };

  const handleDeleteSubject = (id: string) => {
    const confirmacion = window.confirm(
      "Si eliminas este sujeto se perderá para siempre"
    );
    if (!confirmacion) return;

    // Si eliminas un sujeto, podrías querer limpiar sus notas (opcional).
    // Si NO quieres borrarlas automáticamente, comenta el bloque siguiente.
    const subjectNotes = noteRepo.listBySubject(id);
    subjectNotes.forEach((n) => noteRepo.remove(n.id));

    repo.remove(id);
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    if (selected?.id === id) setSelectedSubject(null);

    // refrescar notas
    setNotes(
      selected?.id ? noteRepo.listBySubject(selected.id) : noteRepo.list()
    );
  };
  const handleOpenEditSubject = (s: Subject) => {
    setEditingSubject(s);
    setIsEditSubjectOpen(true);
  };
  const handleUpdateSubject = (id: string, patch: Partial<Subject>) => {
    const updated = repo.update(id, patch);
    if (!updated) return; // si no existe, no hace nada
    setSubjects((prev) => prev.map((x) => (x.id === id ? updated : x)));
    // si el sujeto seleccionado es el mismo, refresca también
    setSelectedSubject((cur) => (cur && cur.id === id ? updated : cur));
    setIsEditSubjectOpen(false);
    setEditingSubject(null);
  };
  // ! NOTAS
  const handleCreateNote = (note: Note) => {
    noteRepo.create(note);
    // refrescar según contexto
    setNotes(
      selected?.id ? noteRepo.listBySubject(selected.id) : noteRepo.list()
    );
    setIsCreateNoteOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    const ok = window.confirm("¿Eliminar esta nota?");
    if (!ok) return;
    noteRepo.remove(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNote?.id === id) setSelectedNote(null);
  };

  const subjectsMap = useMemo(() => {
    const m = new Map<string, Subject>();
    subjects.forEach((s) => m.set(s.id, s));
    return m;
  }, [subjects]);

  const memorableNotes = useMemo(() => {
    const list = notes.filter((n) => n.esMemorable);
    // orden descendente por fecha
    return list.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  }, [notes]);

  return (
    <div className="container">
      <header className="row-wrap spread" style={{ marginBottom: 16 }}>
        <h1 className="h1">Diario de Interacción</h1>
        <div className="row-wrap">
          <AddSubjectButton onClick={() => setIsCreateSubjectOpen(true)} />
          <AddNoteButton
            onClick={() => setIsCreateNoteOpen(true)}
            disabled={subjects.length === 0}
          />
        </div>
      </header>

      <section style={{ marginBottom: 8 }}>
        <SubjectsTable
          subjects={subjects}
          onRowClick={setSelectedSubject}
          onDelete={handleDeleteSubject}
          onEdit={handleOpenEditSubject} // <-- NUEVO
        />
      </section>
      {isEditSubjectOpen && editingSubject && (
        <EditSubjectModal
          subject={editingSubject}
          onClose={() => {
            setIsEditSubjectOpen(false);
            setEditingSubject(null);
          }}
          onSubmit={(patch) => handleUpdateSubject(editingSubject.id, patch)}
        />
      )}

      <section className="card">
        <div className="row-wrap spread" style={{ marginBottom: 8 }}>
          <h2 className="h2">
            Notas {selected ? `de ${selected.nombre}` : "(todas)"}
          </h2>
          <small className="muted">
            {notes.length} {notes.length === 1 ? "nota" : "notas"}
          </small>
        </div>

        <NotesTable
          notes={notes}
          subjectsMap={subjectsMap}
          onView={(n) => setSelectedNote(n)}
          onDelete={(id) => handleDeleteNote(id)}
        />
      </section>

      {/* Modales */}
      {isCreateOpen && (
        <CreateSubjectModal
          onClose={() => setIsCreateSubjectOpen(false)}
          onCreate={handleCreateSubject}
        />
      )}

      {selected && (
        <SubjectDetailsModal
          subject={selected}
          onClose={() => setSelectedSubject(null)}
          onEdit={(s) => {
            setSelectedSubject(null); // cierra el details
            handleOpenEditSubject(s); // abre el editor
          }}
        />
      )}

      {isCreateNoteOpen && (
        <CreateNoteModal
          subjects={subjects}
          onClose={() => setIsCreateNoteOpen(false)}
          onCreate={handleCreateNote}
          initialSubjectId={selected?.id}
        />
      )}

      {selectedNote && (
        <NoteDetailsModal
          note={selectedNote}
          subject={subjectsMap.get(selectedNote.subjectId) || null}
          onClose={() => setSelectedNote(null)}
          onDelete={() => {
            handleDeleteNote(selectedNote.id);
          }}
        />
      )}

      <section className="card" style={{ marginTop: 16 }}>
        <div className="row-wrap spread" style={{ marginBottom: 8 }}>
          <h2 className="h2">Momentos memorables</h2>
          <small className="muted">
            {memorableNotes.length}{" "}
            {memorableNotes.length === 1 ? "momento" : "momentos"}
          </small>
        </div>

        <MemorableNotesList
          notes={memorableNotes}
          subjectsMap={subjectsMap}
          onSelect={(n) => setSelectedNote(n)}
        />
      </section>
      {selectedNote && (
        <NoteDetailsModal
          note={selectedNote}
          subject={subjectsMap.get(selectedNote.subjectId) || null}
          onClose={() => setSelectedNote(null)}
          onDelete={() => {
            handleDeleteNote(selectedNote.id);
          }}
        />
      )}
    </div>
  );
}
