'use client'

import { Button } from "@/components/ui/button";
import { useNoteManager } from "@/hooks/useNoteManager";
import NoteList from "@/components/note-list";
import { CreateNoteDialog } from "@/components/create-note-dialog";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const {
    notes,
    createNote,
    deleteNote,
    refreshNotes
  } = useNoteManager()

  const handleCreateTask = async (title: string, content: string) => {
    await createNote(title, content);
    await refreshNotes();
  }
  
  const { signOut } = useAuth()
  const handleSignOut = async () => {
    await signOut();
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-background text-foreground">
      <header className="sticky top-0 z-10 p-4 flex justify-between w-full bg-muted rounded-b-lg align-middle">
      <h1 className="h-full text-2xl">Meeting Memories</h1>
      <CreateNoteDialog onSubmit={handleCreateTask}/>
      <Button variant="ghost" onClick={handleSignOut}>Sign Out</Button>
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
