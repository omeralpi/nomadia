"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams, useSearchParams } from "next/navigation";

export default function Page() {
    const params = useParams();
    const searchParams = useSearchParams();
    const userId = params.userId as string;
    const initialMessage = searchParams.get("initialMessage");

    return (
        <div className="flex h-screen flex-col">
            <div className="fixed top-0 left-0 right-0 z-10 bg-background">
                <ChatHeader />
            </div>
            <div className="flex-1 overflow-hidden pt-16 pb-24">
                <ScrollArea className="h-full">
                    <ChatMessages userId={userId} />
                </ScrollArea>
            </div>
            <div className="fixed bottom-0 left-0 right-0 bg-background">
                <ChatInput userId={userId} initialMessage={initialMessage} />
            </div>
        </div>
    );
}