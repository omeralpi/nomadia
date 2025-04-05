"use client";

import { ChatMessagesSkeleton } from "@/components/chat/chat-messages-skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

interface ChatMessagesProps {
    conversationId: number;
}

export function ChatMessages({ conversationId }: ChatMessagesProps) {
    const { data: session } = useSession();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { ref, inView } = useInView();

    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage
    } = api.chat.getMessages.useInfiniteQuery(
        {
            conversationId,
            limit: 50,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [data?.pages[0].items]);

    if (isLoading) {
        return <ChatMessagesSkeleton />;
    }

    return (
        <div className="flex flex-col-reverse gap-4 p-4">
            <div ref={messagesEndRef} />

            {data?.pages.map((page, i) => (
                <div key={i} className="space-y-4">
                    {page.items.map((message) => {
                        const isSender = message.senderId === session?.user.id;

                        return (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex items-end gap-2",
                                    isSender && "flex-row-reverse"
                                )}
                            >
                                <UserAvatar
                                    src={message.sender.image}
                                    fallback={message.sender.name?.[0]}
                                    className="h-6 w-6"
                                />
                                <div
                                    className={cn(
                                        "rounded-lg px-3 py-2 max-w-[70%]",
                                        isSender ? "bg-primary text-primary-foreground" : "bg-muted"
                                    )}
                                >
                                    <p className="text-sm">{message.content}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                        );
                    })}
                </div>
            ))}

            {hasNextPage && (
                <div
                    className="flex justify-center"
                    ref={ref}
                >
                    {isFetchingNextPage && (
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    )}
                </div>
            )}
        </div>
    );
} 