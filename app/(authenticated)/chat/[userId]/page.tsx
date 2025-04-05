"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { DefaultLayout } from "@/components/default-layout";
import { useParams, useSearchParams } from "next/navigation";

export default function Page() {
    const params = useParams();
    const searchParams = useSearchParams();
    const userId = params.userId as string;
    const initialMessage = searchParams.get("initialMessage");

    return (
        <>
            <ChatHeader />
            <DefaultLayout>
                <ChatMessages userId={userId} />
                <ChatInput userId={userId} initialMessage={initialMessage} />
            </DefaultLayout>
        </>
    );
}