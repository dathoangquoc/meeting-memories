'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useNoteManager } from "@/hooks/useNoteManager";
import NoteList from "@/components/note-list";
import { CreateNoteDialog } from "@/components/create-note-dialog";
import useAuth from "@/hooks/useAuth";

export default function Home() {
  const {
    notes,
    createNote,
    deleteNote,
    refreshNotes
  } = useNoteManager()

  const { user } = useAuth()
  const handleCreateTask = async (title: string, content: string) => {
    await createNote(title, content);
    await refreshNotes();
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-background text-foreground">
      <header className="sticky top-0 z-10 p-4 flex justify-between w-full bg-muted rounded-b-lg align-middle">
      <h1 className="h-full text-2xl">Meeting Memories</h1>
      <CreateNoteDialog onSubmit={handleCreateTask}/>
      <Button asChild variant="ghost">
        <Link href="/login">Log In</Link>
      </Button>
      </header>
      {notes.length > 0 ? (
        <NoteList
        notes={notes}
        onDelete={deleteNote}
      />
      ) : (
        <p className="p-12">Create a Note to get started.</p>
      )
      }
          
    </main>
  );
}
