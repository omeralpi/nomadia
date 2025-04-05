import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiCheckLine, RiMapPinFill, RiMapPinLine, RiMoneyDollarCircleLine } from "@remixicon/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CurrencyCombobox } from "./currency-combobox";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormSubmitButton } from "./ui/form";
import { Input } from "./ui/input";

export const listingFormSchema = z.object({
    type: z.enum(["buying", "selling"]),
    currencyCode: z.string().min(1, "Please select a currency"),
    currencyType: z.enum(["fiat", "crypto"]),
    amount: z.number().min(1, "Please enter an amount"),
    latitude: z.number(),
    longitude: z.number(),
});

export type ListingFormValues = z.infer<typeof listingFormSchema>;

interface ListingFormProps {
    defaultValues?: Partial<ListingFormValues>;
    onSubmit: (data: ListingFormValues) => Promise<void>;
}

export const ListingForm = ({
    defaultValues,
    onSubmit,
}: ListingFormProps) => {
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState<string>();

    const form = useForm<ListingFormValues>({
        resolver: zodResolver(listingFormSchema),
        defaultValues: {
            type: "buying",
            amount: 0,
            currencyType: "fiat",
            ...defaultValues,
        },
    });

    const currentType = form.watch("type");
    const currentLocation = form.watch("latitude") && form.watch("longitude") ? {
        latitude: form.watch("latitude"),
        longitude: form.watch("longitude"),
    } : undefined;

    const handleGetLocation = () => {
        setIsLocating(true);
        setLocationError(undefined);

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                form.setValue("latitude", position.coords.latitude);
                form.setValue("longitude", position.coords.longitude);
                setIsLocating(false);
            },
            (error) => {
                setLocationError("Unable to get your location");
                setIsLocating(false);
            }
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-20">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>What do you want to do?</FormLabel>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        type="button"
                                        variant={field.value === "buying" ? "default" : "outline"}
                                        onClick={() => field.onChange("buying")}
                                        className={cn("w-full")}
                                    >
                                        Buying
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={field.value === "selling" ? "default" : "outline"}
                                        onClick={() => field.onChange("selling")}
                                        className={cn("w-full")}
                                    >
                                        Selling
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-2">
                        <div className="flex items-end justify-between">
                            <FormLabel>Location</FormLabel>
                            {currentLocation && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleGetLocation}
                                    className="text-muted-foreground hover:text-muted-foreground/80 hover:bg-muted -ml-2"
                                >
                                    <RiMapPinLine className="w-4 h-4 mr-1" />
                                    Update Location
                                </Button>
                            )}
                        </div>
                        <div className="space-y-3">
                            {!currentLocation && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGetLocation}
                                    disabled={isLocating}
                                    className="w-full"
                                >
                                    <RiMapPinLine className="w-5 h-5 mr-2" />
                                    {isLocating ? "Getting Location..." : "Get My Location"}
                                </Button>
                            )}

                            {locationError && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                                    <p className="text-sm text-red-600 flex items-center">
                                        <RiMapPinLine className="w-4 h-4 mr-2 flex-shrink-0" />
                                        {locationError}
                                    </p>
                                </div>
                            )}

                            {currentLocation && (
                                <div className="p-4 rounded-lg bg-muted border border-muted">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                                <RiMapPinFill className="w-5 h-5 text-green-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center">
                                                <p className="text-sm font-medium">Location Obtained</p>
                                                <RiCheckLine className="w-4 h-4 text-green-600 ml-2" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Latitude</p>
                                                    <p className="text-sm font-medium text-muted-foreground">{currentLocation.latitude.toFixed(6)}°</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Longitude</p>
                                                    <p className="text-sm font-medium text-muted-foreground">{currentLocation.longitude.toFixed(6)}°</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="currencyCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Currency</FormLabel>
                                <FormControl>
                                    <CurrencyCombobox
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder="Enter amount"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4">
                    <FormSubmitButton type="submit" className="w-full" disabled={!currentLocation}>
                        <RiMoneyDollarCircleLine className="w-5 h-5" />
                        Submit
                    </FormSubmitButton>
                    <div className="safe-area-spacer" />
                </div>
            </form>
        </Form>
    );
}; 