import { SingleNote } from "@/components/single-note";
import { Note } from "@/types/models";

interface NoteListProps {
  notes: Note[],
  onDelete: (noteId: string) => Promise<void>;
  onSave: (noteToSave?: Note) => Promise<void>; 
}

export default function NoteList({ notes, onDelete, onSave }: NoteListProps) {
    return (
      <div className="flex flex-wrap gap-4 w-full h-fit overflow-auto p-2">
        {notes.map((note: Note) => (
            <SingleNote
              key={note.note_id}
              note={note}
              onDelete={onDelete}
              onSave={onSave}
            />
        ))}
      </div>
    )
}