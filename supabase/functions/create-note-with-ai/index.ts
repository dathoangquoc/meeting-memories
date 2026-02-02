// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { GoogleGenAI } from 'npm:@google/genai'


Deno.serve(async (req) => {
  // Accept POST requests
  const { title, content } = await req.json()
  const ai = new GoogleGenAI({});
  
  // Check is req is authorized

  // LLM call
  const prompt = `Based on the following transcription of a meeting title ${title}, write a summary of the meeting. Reply with just the summary and nothing else.`

  const completion = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Explain how AI works in a few words",
  })

  console.log("LLM response:", completion.text)

  // Insert note
  

  return new Response(
    JSON.stringify(completion.text),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-note-with-ai' \
    --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImI4MTI2OWYxLTIxZDgtNGYyZS1iNzE5LWMyMjQwYTg0MGQ5MCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODUzNjY5OTZ9.C83lcK2FnJsS_cw0iGH3MSaIFI-aqEQMnLU1txwvHIdNcDCVL6XD15QIRfQoscuFgui3VtmXgQrWpZ9rmahHFw' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
