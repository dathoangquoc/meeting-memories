import { useEffect, useState } from "react";

type Note = {
    id: string
    title: string
    content: string
    createdAt: string
    updatedAt: string
}

export function useNoteManager(noteId?: string) {
    // State for single note
    const [note, setNote] = useState<Note | null>(null);

    // State for list of notes
    const [notes, setNotes] = useState<Note[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null)

    // Supabase client

    // Single note operations
    // Fetch single note
    useEffect(() => {
        if (!noteId) return;  // Don't fetch without id

        const fetchNote = async () => {
            // supabase fetch
            try {
                
                setNote(note)
            } catch (error: any) {
                console.error("Error fetching note:", error)
                setError(error.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchNote();
    }, [noteId])

    const updateNote = () => {}
    const saveNote = () => {}
    
    // List of notes operations
    // Fetch all notes
    useEffect(() => {
        if (noteId) return;  // Don't fetch if managing a single note
        
    })

    const fetchNotes = async () => {
        try {
            
            setNotes(notes)
        } catch (error: any) {
            console.error("Error fetching notes:", error)
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const createNote = () => {}
    const deleteNote = () => {}
    const refreshNotes = async () => {
        setIsLoading(true)
        await fetchNotes();
    }
}