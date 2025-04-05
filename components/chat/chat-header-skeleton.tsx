import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";

export function ChatHeaderSkeleton() {
    return (
        <div className="flex items-center gap-4 border-b bg-background p-4">
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                disabled
            >
                <ChevronLeft className="h-5 w-5" />
            </Button>
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
        </div>
    );
} 
