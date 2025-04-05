import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Listing } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface ListingAvatarProps {
    listing: Listing,
    size?: 'sm' | 'md' | 'lg'
    selected?: boolean
}

export function ListingAvatar({
    listing,
    size = 'md',
    selected
}: ListingAvatarProps) {
    const sizeClasses = {
        sm: {
            avatar: "h-8 w-8",
            currency: "h-6 w-6 -ml-3",
        },
        md: {
            avatar: "h-12 w-12",
            currency: "h-8 w-8 -ml-4",
        },
        lg: {
            avatar: "h-16 w-16",
            currency: "h-10 w-10 -ml-5",
        },
    };

    return (
        <div className={cn("flex items-center")}>
            <Avatar className={cn(
                sizeClasses[size].avatar,
                "rounded-full border-2 border-white bg-background shadow-lg transition-transform",
                selected && "scale-110 border-primary"
            )}>
                <AvatarImage src={listing.user.image} alt={listing.user.name} />
                <AvatarFallback>{listing.user.name}</AvatarFallback>
            </Avatar>
            <div className={cn(
                sizeClasses[size].currency,
                "relative overflow-hidden rounded-full border-2 border-white bg-background shadow-lg"
            )}>
                {listing.currency.iconUrl ? (
                    <img
                        src={listing.currency.iconUrl}
                        className="h-full w-full object-cover"
                        alt={listing.currency.code}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xs font-medium">
                        {listing.currency.code}
                    </div>
                )}
            </div>
        </div>
    );
} 