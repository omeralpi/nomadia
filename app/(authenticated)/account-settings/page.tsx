"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Copy } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
    const router = useRouter();
    const { data: session, update } = useSession();

    const truncateAddress = (address: string) => {
        if (!address) return "";
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const copyToClipboard = async () => {
        if (!session?.user?.id) return;
        await navigator.clipboard.writeText(session.user.id);
        toast.success("Address copied to clipboard");
    };

    return (
        <main className="container px-4 py-6 mx-auto">
            <div className="space-y-8">
                <div className="relative flex items-center justify-center">
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-0 rounded-full"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Account Settings</h1>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="text-muted-foreground text-sm font-medium">
                        World Identity
                    </div>

                    <div className="rounded-3xl bg-muted flex items-center justify-between px-4 py-2">
                        <div>
                            Wallet Address
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-muted-foreground">
                                {truncateAddress(session?.user?.id || "")}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={copyToClipboard}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
} 