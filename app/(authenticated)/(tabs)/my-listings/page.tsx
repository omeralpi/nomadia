'use client';

import { BasicAlertDialog } from "@/components/basic-alert-dialog";
import { CreateListingDrawer } from "@/components/create-listing-drawer";
import { DefaultLayout } from "@/components/default-layout";
import { EditListingDrawer } from "@/components/edit-listing-drawer";
import { EmptyState } from "@/components/empty-state";
import { ListingAvatar } from "@/components/listing-avatar";
import { ListingTypeBadge } from "@/components/listing-type-badge";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { formatAmount } from "@/lib/utils";
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiFileListLine, RiMoreLine } from "@remixicon/react";
import { toast } from "sonner";

function ListingsSkeleton() {
    return (
        <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                    <div className="flex items-center gap-4">
                        <Skeleton className="size-12 rounded-full" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-16" />
                                <div className="size-1 rounded-full bg-muted-foreground/50" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="mt-1 h-7 w-32" />
                        </div>
                        <Skeleton className="size-8 rounded-full" />
                    </div>
                </Card>
            ))}
        </div>
    );
}

export default function Page() {
    const { data: listings = [], isLoading } = api.listing.myListings.useQuery();
    const utils = api.useUtils();

    const deleteListing = api.listing.delete.useMutation({
        onSuccess: () => {
            toast.success("Listing deleted successfully");
            utils.listing.myListings.invalidate();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return (
        <DefaultLayout>
            <PageHeader
                title="My Listings"
                action={
                    <CreateListingDrawer>
                        <Button
                            size="icon"
                            variant="outline"
                            className="rounded-full"
                        >
                            <RiAddLine className="h-5 w-5" />
                        </Button>
                    </CreateListingDrawer>
                }
            />

            {isLoading ? (
                <ListingsSkeleton />
            ) : listings.length > 0 ? (
                <div className="space-y-6">
                    {listings.map((listing) => (
                        <Card
                            key={`${listing.id}-${listing.amount}-${listing.currencyCode}`}
                        >
                            <div className="flex items-center gap-4">
                                <ListingAvatar
                                    listing={listing}
                                />
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <ListingTypeBadge type={listing.type} />
                                        <div className="size-1 rounded-full bg-muted-foreground/50" />
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(listing.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="text-xl text-muted-foreground font-semibold font-display">
                                        {formatAmount(listing.amount)} {listing.currencyCode}
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="rounded-full"
                                        >
                                            <RiMoreLine className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <EditListingDrawer listing={listing}>
                                            <DropdownMenuItem className="gap-2" onSelect={(e) => {
                                                e.preventDefault();
                                            }}>
                                                <RiEditLine className="h-4 w-4" />
                                                Edit listing
                                            </DropdownMenuItem>
                                        </EditListingDrawer>
                                        <BasicAlertDialog
                                            title="Delete listing"
                                            desc="Are you sure you want to delete this listing?"
                                            onSubmit={async () => {
                                                await deleteListing.mutateAsync({ id: listing.id });
                                            }}>
                                            <DropdownMenuItem
                                                className="gap-2 text-destructive focus:text-destructive"
                                                onSelect={(e) => {
                                                    e.preventDefault();
                                                }}
                                            >
                                                <RiDeleteBinLine className="h-4 w-4" />
                                                Delete listing
                                            </DropdownMenuItem>
                                        </BasicAlertDialog>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={<RiFileListLine className="h-8 w-8" />}
                    title="No listings found"
                    description="Create a listing to get started"
                    action={
                        <CreateListingDrawer>
                            <Button>Create listing</Button>
                        </CreateListingDrawer>
                    }
                />
            )}
        </DefaultLayout>
    );
}