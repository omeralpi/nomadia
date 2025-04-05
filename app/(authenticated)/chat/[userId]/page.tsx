"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { DefaultLayout } from "@/components/default-layout";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams();
    const userId = params.userId as string;

    return (
        <>
            <ChatHeader />
            <DefaultLayout>
                <ChatMessages userId={userId} />
                <ChatInput userId={userId} />
            </DefaultLayout>
        </>
    );
}