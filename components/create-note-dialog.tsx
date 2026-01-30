import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useNoteManager } from "@/hooks/useNoteManager"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react";

interface CreateNoteDialogProps {
    onSubmit: (title: string, content: string) => Promise<void>; 
}

export function CreateNoteDialog({ onSubmit }: CreateNoteDialogProps) {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await onSubmit(title, content);
            setTitle("");
            setContent("");
        } catch (err: any) {
            setError(err.messsage)
        } finally {
            setIsSubmitting(false)
        }
    }
    
    return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="absolute left-1/2 -translate-x-1/2">Create Note</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
          <DialogDescription>
            Paste the meeting log here and the AI will create the note for you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                        id="title"
                        type="text"
                        placeholder="Super duper important meeting"
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="content">Content</FieldLabel>
                    <Textarea id="content" placeholder="All the details here" />
                </Field>
                <Button type="submit">Submit</Button>
            </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
