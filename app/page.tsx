import Link from "next/link"
import { HeroHeader } from "@/components/header"
import HeroSection from "@/components/hero-section"
import Pricing from "@/components/pricing-3"

export default function LandingPage() {
    return (
        <main>
            <HeroHeader/>
            <HeroSection/>
            <Pricing/>
        </main>
    )
}