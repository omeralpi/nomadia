"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function Page() {
    const { data: session } = useSession();

    return (
        <main className="container max-w-md p-6 pb-safe animate-in fade-in duration-500">
            <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                            Signed in as
                        </div>
                        <div className="font-medium">
                            {session?.user?.name || "Anonymous User"}
                        </div>
                    </div>

                    <Button
                        variant="destructive"
                        className="w-full transition-transform active:scale-95"
                        onClick={() => signOut({ callbackUrl: "/" })}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}