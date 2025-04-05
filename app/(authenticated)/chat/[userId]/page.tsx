"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatHeaderSkeleton } from "@/components/chat/chat-header-skeleton";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams();
    const userId = params.userId as string;

    const { data: user, isLoading: isLoadingUser } = api.user.getById.useQuery({ id: userId });

    const { data: conversation } = api.chat.getConversationByUser.useQuery({
        userId
    });

    return (
        <div className="flex h-full flex-col">
            {isLoadingUser ? (
                <ChatHeaderSkeleton />
            ) : user ? (
                <ChatHeader
                    name={user.name ?? "Anonymous"}
                    image={user.image}
                />
            ) : null}
            <div className="flex-1 overflow-y-auto">
                {conversation && (
                    <ChatMessages conversationId={conversation.id} />
                )}
            </div>
            <ChatInput userId={userId} />
        </div>
    );
}