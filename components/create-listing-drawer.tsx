import { api } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import { DefaultLayout } from "./default-layout";
import { ListingForm, ListingFormValues } from "./listing-form";
import { PageHeader } from "./page-header";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";

export const CreateListingDrawer = ({ children }: {
    children: React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const utils = api.useUtils()

    const createListing = api.listing.create.useMutation({
        onSuccess: () => {
            toast.success("Listing created successfully");

            setIsOpen(false);

            utils.listing.myListings.invalidate();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleSubmit = async (data: ListingFormValues) => {
        await createListing.mutateAsync({
            type: data.type,
            amount: data.amount.toString(),
            currencyCode: data.currencyCode,
            latitude: data.latitude.toString(),
            longitude: data.longitude.toString(),
        });
    };

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent className="h-[96%]">
                <DefaultLayout>
                    <PageHeader title="Create New Listing" />
                    <ListingForm
                        defaultValues={{
                            type: "buying",
                        }}
                        onSubmit={handleSubmit}
                    />
                    <div className="safe-area-spacer" />
                </DefaultLayout>
            </DrawerContent>
        </Drawer>
    );
}; 