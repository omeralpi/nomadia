"use client";

import { IntroSlider } from "@/components/intro-slider";
import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();
    const { data: session } = useSession();
    const { data: user } = api.user.get.useQuery();

    useEffect(() => {
        if (user && !user.name) {
            router.push("/complete-profile");
        }
    }, [user, router]);

    return (
        <main className="flex min-h-screen flex-col bg-gradient-to-b from-background to-secondary/20">
            <IntroSlider />
        </main>
    );
}