"use client";

import { ChatListSkeleton } from "@/components/chat/chat-list-skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { api } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "../empty-state";
import { ChatSearch } from "./chat-search";

export function ChatList() {
    const { data: conversations, isLoading } = api.chat.getConversations.useQuery();
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredConversations = conversations.filter((conversation) => {
        if (!searchQuery) return true;
        const participantName = conversation.participants[0]?.name?.toLowerCase() ?? "";
        const lastMessage = conversation.lastMessage?.content.toLowerCase() ?? "";
        return participantName.includes(searchQuery.toLowerCase()) || lastMessage.includes(searchQuery.toLowerCase());
    });

    if (searchQuery && !filteredConversations.length) {
        return (
            <>
                <ChatSearch onSearch={setSearchQuery} />
                <EmptyState
                    icon={<MessageCircleIcon className="h-10 w-10" />}
                    title="No results found"
                    description="Try searching with different keywords"
                />
            </>
        );
    }

    return (
        <>
            <ChatSearch onSearch={setSearchQuery} />
            <div className="space-y-2">
                {filteredConversations.map((conversation) => (
                    <Link
                        key={conversation.id}
                        href={`/chat/${conversation.participants[0]?.id}`}
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
                                        {conversation.participants[0]?.name || 'Anonymous'}
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
                                {conversation.unreadCount > 0 && (
                                    <div className="rounded-full size-5 bg-primary flex items-center justify-center text-[10px] text-background">
                                        {conversation.unreadCount}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
} 