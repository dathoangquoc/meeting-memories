import Link from "next/link"

export default function LandingPage() {
    return (
        <main>
            <p>Hello</p>
            <p>
                <Link href="/login">Log In</Link>
            </p>
            <p>
                <Link href="/signup">Sign Up</Link>
            </p>
        </main>
    )
}