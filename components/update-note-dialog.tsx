import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Note } from "@/types/models";

interface UpdateNoteDialogProps {
  noteData: Note;
  onDelete: (noteId: string) => Promise<void>;
  onSubmit: (noteToSave?: Note) => Promise<void>;
}

export function UpdateNoteDialog({
  noteData,
  onSubmit,
  onDelete,
}: UpdateNoteDialogProps) {
  const [title, setTitle] = useState(noteData.title);
  const [content, setContent] = useState(noteData.content);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ title, content, note_id: noteData.note_id });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} autoComplete="off">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                type="text"
                placeholder="Super duper important meeting"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="content">Content</FieldLabel>
              <Textarea
                id="content"
                placeholder="All the details here"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Field>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {/* Buttons */}
            <div className="flex justify-between">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  onDelete(noteData.note_id);
                }}
              >
                <Trash2 />
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
