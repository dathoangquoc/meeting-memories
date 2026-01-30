import { SingleNote } from "@/components/single-note";
import { Note } from "@/types/models";

interface NoteListProps {
  notes: Note[],
  onDelete: (noteId: string) => Promise<void>; 
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(380px,1fr))] content-start gap-4 w-full min-h-screen p-2">
        {notes.map((note: Note) => (
            <SingleNote
              key={note.id}
              note={note}
              onDelete={onDelete}
            />
        ))}
      </div>
    )
}