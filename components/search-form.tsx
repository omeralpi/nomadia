import { RiSearchLine } from "@remixicon/react";
import { Input } from "./ui/input";

interface SearchFormProps {
    placeholder: string;
}

export function SearchForm({ placeholder }: SearchFormProps) {
    return (
        <div className="relative">
            <RiSearchLine className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground size-[16px] z-10" />
            <Input className="pl-12 bg-muted/50 backdrop-blur rounded-3xl" placeholder={placeholder} />
        </div>
    );
}