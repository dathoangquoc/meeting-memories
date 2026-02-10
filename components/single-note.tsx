import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Note } from "@/types/models";
import { UpdateNoteDialog } from "./update-note-dialog";

interface SingleNoteProps {
  note: Note;
  onDelete: (noteId: string) => Promise<void>;
  onSave: (noteToSave?: Note) => Promise<void>;
}

export function SingleNote({ note, onDelete, onSave }: SingleNoteProps) {
  return (
    <Card className="group mx-auto w-full min-w-36 min-h-72 max-w-sm max-h-80 shadow-md">
      <CardHeader className="flex mt-0 items-center justify-between border-b-2 pb-2 h-fit">
        <CardTitle>{note.title ?? "Empty"}</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-all duration-200"
            onClick={() => {
              onDelete(note.note_id);
            }}
          >
            <Trash2 />
          </Button>
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-200">
            <UpdateNoteDialog noteData={note} onSubmit={onSave} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="max-h-full">
        <p className="overflow-y-scroll max-h-52">
          {note.content ?? "lorem ipsum ".repeat(50)}
        </p>
      </CardContent>
    </Card>
  );
}
