'use client'

import { Button } from "@/components/ui/button";
import { useNoteManager } from "@/hooks/useNoteManager";
import NoteList from "@/components/note-list";
import { CreateNoteDialog } from "@/components/create-note-dialog";
import { useAuth } from "@/context/AuthContext";
import { Note } from "@/types/models";

export default function Dashboard() {
  const {
    notes,
    createNoteWithLLM,
    saveNote,
    deleteNote,
    refreshNotes
  } = useNoteManager()
  
  const handleSaveNote = async (noteToSave?: Note) => {
    await saveNote(noteToSave);
    await refreshNotes();
  }

  const { signOut, user } = useAuth()
  const handleSignOut = async () => {
    await signOut();
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-background text-foreground">
      <header className="sticky top-0 z-10 p-4 flex justify-between w-full bg-muted rounded-b-lg align-middle">
      <h1 className="h-full text-2xl font-serif">Meeting Memories</h1>
      <CreateNoteDialog onSubmit={createNoteWithLLM}/>
      <Button variant="ghost" onClick={handleSignOut}>Sign Out</Button>
      </header>
      <p className="py-2 text-xs">1/10 notes created this month</p>
      {notes.length > 0 ? (
        <NoteList
        notes={notes}
        onDelete={deleteNote}
        onSave={handleSaveNote}
      />
      ) : (
        <p className="p-12">Create a Note to get started.</p>
      )
      }
          
    </main>
  );
}
