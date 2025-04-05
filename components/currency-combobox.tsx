import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "./ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "./ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./ui/popover";

interface CurrencyComboboxProps {
    value?: string;
    onValueChange: (value: string) => void;
}

export function CurrencyCombobox({ value, onValueChange }: CurrencyComboboxProps) {
    const [open, setOpen] = useState(false);

    const { data: currencies = [] } = api.listing.currencies.useQuery();

    const formContext = useFormContext();
    const currencyType = formContext.watch("currencyType");

    const filteredCurrencies = currencyType
        ? currencies.filter((currency) => currency.type === currencyType)
        : currencies;

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
                <Button
                    type="button"
                    variant={currencyType === "fiat" ? "default" : "outline"}
                    onClick={() => {
                        formContext.setValue("currencyType", "fiat");
                        onValueChange("");
                    }}
                    className="w-full"
                >
                    Fiat Currency
                </Button>
                <Button
                    type="button"
                    variant={currencyType === "crypto" ? "default" : "outline"}
                    onClick={() => {
                        formContext.setValue("currencyType", "crypto");

                        onValueChange("");
                    }}
                    className="w-full"
                >
                    Cryptocurrency
                </Button>
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={!currencyType}
                    >
                        {value ? (
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
                        ) : (
                            currencyType ? `Select ${currencyType} currency...` : "Select currency type first..."
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search currency..." />
                        <CommandEmpty>No currency found.</CommandEmpty>
                        <CommandGroup>
                            {filteredCurrencies.map((currency) => (
                                <CommandItem
                                    key={currency.code}
                                    value={currency.code}
                                    onSelect={(currentValue) => {
                                        onValueChange(currentValue);
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
                                                alt={currency.code}
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
        </div>
    );
} 