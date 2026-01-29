import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Note } from "@/components/note";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-background text-foreground">
      <header className="sticky top-0 z-10 p-4 flex justify-between w-full bg-muted rounded-b-lg align-middle">
      <h1 className="h-full text-2xl">Meeting Memories</h1>
      <Button className="absolute left-1/2 -translate-x-1/2">Create Note</Button>
      <Button asChild variant="ghost">
        <Link href="/login">Log In</Link>
      </Button>
      </header>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(380px,1fr))] content-start gap-4 w-full min-h-screen p-2">
        <Note></Note>
        <Note></Note>
        <Note></Note>
      </div>
    </main>
  );
}
