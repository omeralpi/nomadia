"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            router.push("/events");
        }
    }, [session, router]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-secondary/20">
            <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
                        Welcome to Nomad Realm
                    </h1>

                    <div className="text-muted-foreground text-lg animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
                        Ready for new adventures?
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-500">
                    <Button
                        size="lg"
                        className="w-full max-w-xs relative overflow-hidden transition-transform active:scale-95 hover:shadow-lg"
                        onClick={() => signIn("worldcoin")}
                    >
                        <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                        <span className="relative flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Sign In
                        </span>
                    </Button>
                </div>
            </div>
        </main>
    );
}