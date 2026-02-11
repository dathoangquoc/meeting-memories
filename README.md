# Meeting Memories

Meeting Memories is a web application for capturing, summarizing, and managing meeting notes with AI assistance. Built with Next.js, Supabase, and Tailwind CSS, it enables users to create, update, and organize meeting notes efficiently.

## Features
- User authentication (sign up, login, protected routes)
- Create, update, and delete meeting notes
- AI-powered meeting summary generation (Gemini API)
- Responsive dashboard for managing notes
- Modern UI with Tailwind CSS

## Tech Stack
- Next.js (App Router)
- Supabase (Database, Auth, Edge Functions)
- Tailwind CSS
- TypeScript
- Vercel (Deployment)

## Getting Started

### Prerequisites
- Node.js (18+ recommended)
- Supabase CLI

### Setup
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd meeting-memories
   ```
2. **Install dependencies:**
   ```bash
   bun install
   # or
   npm install
   ```
3. **Configure Supabase:**
   - Install Supabase CLI: https://supabase.com/docs/guides/cli
   - Start Supabase locally:
     ```bash
     supabase start
     ```
   - Update `supabase/config.toml` and environment variables as needed.
4. **Set up environment variables:**
   - Create a `.env.local` file in the root directory.
   - Add your Supabase and Gemini API keys:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     GEMINI_API_KEY=your-gemini-api-key
     ```
5. **Run the development server:**
   ```bash
   bun run dev
   # or
   npm run dev
   ```
6. **Access the app:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `app/` — Next.js app directory (pages, layouts, routes)
- `components/` — Reusable UI and feature components
- `context/` — React context providers (e.g., Auth)
- `hooks/` — Custom React hooks
- `lib/` — Utility functions and Supabase client
- `supabase/` — Supabase config, migrations, and Edge Functions
- `types/` — TypeScript type definitions
- `tests/` — Integration and utility tests

## License
MIT

## Acknowledgements
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)
- [Google Gemini API](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
