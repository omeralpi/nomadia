"use client";

import { RiSearchLine } from "@remixicon/react";
import { useState } from "react";
import { Input } from "../ui/input";

export type ChatSearchProps = {
    onSearch: (term: string) => void;
};

export function ChatSearch({ onSearch }: ChatSearchProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        onSearch(term);
    };

    return (
        <div className="relative">
            <RiSearchLine className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground size-[16px] z-10" />
            <Input
                className="pl-12 bg-muted/50 backdrop-blur rounded-3xl"
                placeholder="Search messages"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    );
} 