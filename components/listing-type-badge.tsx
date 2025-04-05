import { cn } from "@/lib/utils";

interface ListingTypeBadgeProps {
    type: "buying" | "selling";
    className?: string;
}

export function ListingTypeBadge({ type, className }: ListingTypeBadgeProps) {
    return (
        <div className={cn(
            "px-2 py-0.5 rounded-full text-white text-xs font-medium border border-white/20 bg-gray-700",
            className
        )}>
            {type === "buying" ? "Buying" : "Selling"}
        </div>
    );
} 