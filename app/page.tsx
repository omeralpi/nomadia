"use client";

import { IntroSlider } from "@/components/intro-slider";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col bg-gradient-to-b from-background to-secondary/20">
            <IntroSlider />
        </main>
    );
}