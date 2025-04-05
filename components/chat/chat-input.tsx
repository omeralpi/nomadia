"use client";

import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { RiSendPlane2Fill } from "@remixicon/react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";

interface ChatInputProps {
    userId: string;
}

export function ChatInput({ userId }: ChatInputProps) {
    const [content, setContent] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const utils = api.useUtils();

    const { mutate: sendMessage, isPending } = api.chat.sendMessage.useMutation({
        onSuccess: () => {
            setContent("");
            utils.chat.getConversations.invalidate();
            utils.chat.getConversationByUser.invalidate({ userId });
            utils.chat.getMessages.invalidate();
        },
    });

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
        }
    };

    const handleSubmit = () => {
        if (!content.trim() || isPending) return;

        sendMessage({
            userId,
            content: content.trim(),
        });
    };

    return (
        <div className="p-4 fixed bottom-0 left-0 right-0">
            <div className="relative">
                <Textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        adjustTextareaHeight();
                    }}
                    placeholder="Type a message..."
                    className="rounded-3xl bg-muted min-h-[34px] max-h-[150px] resize-none"
                    disabled={isPending}
                />
                <div className="flex absolute top-0 right-0 bottom-0 px-4 items-center">
                    <Button
                        onClick={handleSubmit}
                        size='icon'
                        disabled={!content.trim() || isPending}
                        className="h-10 w-10 rounded-full"
                    >
                        <RiSendPlane2Fill className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            <div className="safe-area-spacer" />
        </div>
    );
} 