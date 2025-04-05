"use client";

import { ChatListSkeleton } from "@/components/chat/chat-list-skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { api } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { EmptyState } from "../empty-state";

export function ChatList() {
    const params = useParams();

    const { data: conversations, isLoading } = api.chat.getConversations.useQuery();

    if (isLoading) {
        return <ChatListSkeleton />;
    }

    if (!conversations?.length) {
        return (
            <EmptyState
                icon={<MessageCircleIcon className="h-10 w-10" />}
                title="No conversations yet"
                description="Start a new conversation with someone"
            />
        );
    }

    return (
        <div className="space-y-2">
            {conversations.map((conversation) => (
                <Link
                    key={conversation.id}
                    href={`/chat/${conversation.id}`}
                    className={`py-3 block`}
                >
                    <div className="relative items-center gap-4 flex items-center justify-between transition-colors">
                        <div className="overflow-hidden flex gap-3 items-center flex-1">
                            <UserAvatar
                                src={conversation.participants[0]?.image}
                                fallback={conversation.participants[0]?.name?.[0]}
                            />
                            <div className="space-y-1">
                                <div className="font-medium">
                                    {conversation.participants[0]?.name}
                                </div>
                                {conversation.lastMessage && (
                                    <div className="truncate text-sm text-muted-foreground">
                                        {conversation.lastMessage.content}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 absolute top-0 right-0">
                            {conversation.lastMessage && (
                                <div className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                                </div>
                            )}
                            <div className="rounded-full size-5 bg-primary flex items-center justify-center text-[10px] text-background">
                                2
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
} 