import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Note } from "@/types/models";
import { UpdateNoteDialog } from "./update-note-dialog";
import { ScrollArea } from "./ui/scroll-area";

interface SingleNoteProps {
  note: Note;
  onDelete: (noteId: string) => Promise<void>;
  onSave: (noteToSave?: Note) => Promise<void>;
}

export function SingleNote({ note, onDelete, onSave }: SingleNoteProps) {
  return (
    <Card className="group mx-auto w-full min-w-36 min-h-72 max-w-sm max-h-80 shadow-md">
      <CardHeader className="flex flex-row mt-0 items-center justify-between border-b-2 pb-2 h-fit">
        <CardTitle className="flex flex-row my-2">
          {note.title ?? "Empty"}
        </CardTitle>
        <div className="h-fit opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
          <UpdateNoteDialog
            noteData={note}
            onSubmit={onSave}
            onDelete={onDelete}
          />
        </div>
      </CardHeader>
      <CardContent className="max-h-full p-4">
        <ScrollArea className="overflow-y-scroll h-full text-wrap break-words whitespace-pre-wrap">
          <p>{note.content}</p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
