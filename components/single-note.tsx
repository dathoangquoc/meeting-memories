import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
        <CardTitle className="flex flex-row my-2">{note.title ?? "Empty"}</CardTitle>
      </CardHeader>
      <CardContent className="max-h-full p-4">
        <p className="overflow-y-scroll h-full text-wrap break-words whitespace-pre-wrap">
          {note.content ?? "lorem ipsum ".repeat(50)}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
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
      </CardFooter>
    </Card>
  );
}
