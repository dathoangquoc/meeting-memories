import Link from "next/link"

export default function LandingPage() {
    return (
        <main>
            <p>Hello</p>
            <Link href="/login">Log In</Link>
            <Link href="/signup">Sign Up</Link>
        </main>
    )
}