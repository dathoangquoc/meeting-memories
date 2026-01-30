import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Note } from "@/types/models";

interface SingleNoteProps {
  note: Note
  onDelete: (taskId: string) => Promise<void>;
}

export function SingleNote({ note, onDelete }: SingleNoteProps) {
  return (
    <Card className="mx-auto w-full max-w-sm max-h-80">
      <CardHeader className="flex justify-between">
        <CardTitle>{note.title ?? "Empty"}</CardTitle>
        <Button variant="destructive" onClick={() => {onDelete(note.id)}}>Delete</Button>
      </CardHeader>
      <CardContent className="max-h-full">
        <p className="overflow-y-scroll max-h-52">
          {note.content ?? "lorem ipsum ".repeat(50)}
        </p>
      </CardContent>
    </Card>
  )
}