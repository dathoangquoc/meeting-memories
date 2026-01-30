import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Note } from "@/types/models";

export function useNoteManager(noteId?: string) {
    // State for single note
    const [note, setNote] = useState<Note | null>(null);

    // State for list of notes
    const [notes, setNotes] = useState<Note[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null)

    // Supabase client
    const supabase = createClient()

    // Single note operations
    // Fetch single note
    useEffect(() => {
        if (!noteId) return;  // Don't fetch without id

        const fetchNote = async () => {
            // supabase fetch
            try {
                const { data: note, error } = await supabase
                    .from('notes')
                    .select('*')
                    .eq("note_id", noteId)
                    .single();

                if (error) throw error;
                setNote(note)
            } catch (error: any) {
                console.error(`Error fetching note ID ${noteId}:`, error)
                setError(error.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchNote();
    }, [noteId])

    const updateNote = (updates: Partial<Note>) => {
        setNote((prev) => prev ? {...prev, ...updates} : null);
    };
    const saveNote = async (noteToSave?: Note) => {
        try {
            const noteData = noteToSave || note;
            if (!noteData) throw new Error("No note data to save");

            const { error } = await supabase
                .from('notes')
                .update({
                    ...noteData,
                    updated_at: new Date().toISOString()
                })
                .eq('note_id', noteData.id)
        } catch (error: any) {
            console.error("Error saving note:", error);
            setError(error.message);
        }
    };
    
    // List of notes operations
    // Fetch all notes
    useEffect(() => {
        if (noteId) return;  // Don't fetch if managing a single note
        fetchNotes()
    }, [])

    const fetchNotes = async () => {
        try {
            const { data: notes, error } = await supabase
                .from('notes')
                .select('*')
                .order("created_at", { ascending: false });

            if (error) throw error;
            setNotes(notes || [])
        } catch (error: any) {
            console.error("Error fetching notes:", error)
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const createNote = async (title: string, content: string) => {
        try {
            const { error } = await supabase
                .from("notes")
                .insert({title: title, content: content})
            if (error) throw error
        } catch (error: any) {
            console.error("Error creating note:", error)
            setError(error.message)
        }
    }
    
    const deleteNote = async (noteId: string) => {
        try {
            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('note_id', noteId)
            if (error) throw error
            setNotes(notes.filter((n) => n.id !== noteId))

        } catch (error: any) {
            console.error("Error deleting note:", error)
            setError(error.message)
        }
    }
    const refreshNotes = async () => {
        setIsLoading(true)
        await fetchNotes();
    }
    return {
        // States
        note,
        notes,
        isLoading,
        error,

        // Single note operations
        updateNote,
        saveNote,

        // List of notes operations
        createNote,
        deleteNote,
        refreshNotes
    }
}