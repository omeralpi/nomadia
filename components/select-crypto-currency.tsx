import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import * as React from "react";

interface SelectCryptoCurrencyProps {
    value?: string;
    onValueChange: (value: string) => void;
}

export function SelectCryptoCurrency({
    value,
    onValueChange,
}: SelectCryptoCurrencyProps) {
    const [open, setOpen] = React.useState(false);

    const { data: currencies = [] } = api.listing.currencies.useQuery({
        type: "crypto",
    });

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? (
                            <div className="flex items-center gap-2">
                                {currencies.find((currency) => currency.code === value)?.iconUrl && (
                                    <Image
                                        src={currencies.find((currency) => currency.code === value)?.iconUrl || ""}
                                        alt={value}
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                    />
                                )}
                                {currencies.find((currency) => currency.code === value)?.name}
                            </div>
                        )
                        : "Select cryptocurrency..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search cryptocurrency..." />
                    <CommandEmpty>No cryptocurrency found.</CommandEmpty>
                    <CommandGroup>
                        {currencies.map((currency) => (
                            <CommandItem
                                key={currency.code}
                                value={currency.code}
                                onSelect={() => {
                                    onValueChange(currency.code);
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === currency.code ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                <div className="flex items-center gap-2">
                                    {currency.iconUrl && (
                                        <Image
                                            src={currency.iconUrl}
                                            alt={currency.name}
                                            width={24}
                                            height={24}
                                            className="rounded-full"
                                        />
                                    )}
                                    {currency.name}
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
} 