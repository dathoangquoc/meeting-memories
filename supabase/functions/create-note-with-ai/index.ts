// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Load env variables
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";

Deno.serve(async (req) => {
  // Accept preflight requests
  if (req.method !== "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { title, content } = await req.json();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // LLM call
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";
    const prompt = `
  Based on the following transcription of a meeting titled "${title}", write a summary of the meeting. 
  Reply with just the summary and nothing else.
  ### TRANSCRIPTION
  ${content}
  `;

    const completion = await fetch(url, {
      method: "POST",
      headers: {
        "x-goog-api-key": GEMINI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const responseJson = await completion.json();
    const summaryText = responseJson.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    console.log("LLM response:", summaryText);

    // Get user session
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("No user found")
    
    // Insert note
    const { data, error } = await supabase
    .from('notes')
    .insert({
      title: "Made by Gemini",
      content: summaryText,
      user_id: user.id
    })
    .select()
    .single()

    if (error) throw error

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: unknown) {
    console.error(error);
    return new Response();
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-note-with-ai' \
    --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImI4MTI2OWYxLTIxZDgtNGYyZS1iNzE5LWMyMjQwYTg0MGQ5MCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODUzNjY5OTZ9.C83lcK2FnJsS_cw0iGH3MSaIFI-aqEQMnLU1txwvHIdNcDCVL6XD15QIRfQoscuFgui3VtmXgQrWpZ9rmahHFw' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
