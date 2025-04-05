"use client";

import { ChatMessagesSkeleton } from "@/components/chat/chat-messages-skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { RiMessage2Line } from "@remixicon/react";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { EmptyState } from "../empty-state";

interface ChatMessagesProps {
    userId: string;
}

export function ChatMessages({ userId }: ChatMessagesProps) {
    const { data: session } = useSession();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { ref, inView } = useInView();
    const utils = api.useUtils();

    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage
    } = api.chat.getMessages.useInfiniteQuery(
        {
            userId,
            limit: 50,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    const { mutate: markAsRead } = api.chat.markMessagesAsRead.useMutation({
        onSuccess: () => {
            utils.chat.getConversations.invalidate();
        },
    });

    useEffect(() => {
        markAsRead({ userId });
    }, [userId, markAsRead]);

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

    if (!data?.pages[0].items.length) {
        return (
            <EmptyState
                icon={<RiMessage2Line className="h-10 w-10" />}
                title="No messages"
                description="Start a conversation with the user"
            />
        );
    }

    return (
        <div className="flex flex-col-reverse gap-4">
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
                                <div className={cn(
                                    "flex flex-col gap-2 max-w-[70%]",
                                    isSender && "items-end",
                                    !isSender && "items-start"
                                )}>
                                    <div className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                    </div>
                                    <div className="flex items-start justify-end gap-2">
                                        {
                                            !isSender && (
                                                <UserAvatar
                                                    src={message.sender.image}
                                                    fallback={message.sender.name?.[0]}
                                                    className="size-10"
                                                />
                                            )
                                        }
                                        <div
                                            className={cn(
                                                "rounded-lg px-3 py-2",
                                                isSender ? "bg-primary text-primary-foreground" : "bg-muted"
                                            )}
                                        >
                                            {message.content}
                                        </div>
                                    </div>
                                </div>
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