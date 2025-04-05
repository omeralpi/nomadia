import { api } from "@/lib/api";
import { ListingWithRelations } from "@/lib/db/schema";
import { useState } from "react";
import { toast } from "sonner";
import { DefaultLayout } from "./default-layout";
import { ListingForm, ListingFormValues } from "./listing-form";
import { PageHeader } from "./page-header";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";

interface EditListingDrawerProps {
    listing: ListingWithRelations;
    children: React.ReactNode;
}

export const EditListingDrawer = ({ listing, children }: EditListingDrawerProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const utils = api.useUtils();

    const editListing = api.listing.edit.useMutation({
        onSuccess: () => {
            toast.success("Listing updated successfully");

            setIsOpen(false);

            utils.listing.myListings.invalidate();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleSubmit = async (data: ListingFormValues) => {
        await editListing.mutateAsync({
            id: listing.id,
            data: {
                type: data.type,
                amount: data.amount.toString(),
                currencyCode: data.currencyCode,
                latitude: data.latitude.toString(),
                longitude: data.longitude.toString(),
            }
        })
    };

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent className="h-[96%]">
                <DefaultLayout>
                    <PageHeader title="Edit Listing" />
                    <ListingForm
                        defaultValues={{
                            type: listing.type,
                            amount: Number(listing.amount),
                            currencyCode: listing.currencyCode,
                            latitude: Number(listing.latitude),
                            longitude: Number(listing.longitude),
                            currencyType: listing.currency.type,
                        }}
                        onSubmit={handleSubmit}
                    />
                    <div className="safe-area-spacer" />
                </DefaultLayout>
            </DrawerContent>
        </Drawer>
    );
}; 