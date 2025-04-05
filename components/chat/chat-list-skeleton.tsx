import { Skeleton } from "@/components/ui/skeleton";

export function ChatListSkeleton() {
    return (
        <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-4 rounded-lg p-4 transition-colors"
                >
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-4 w-[80%]" />
                    </div>
                </div>
            ))}
        </div>
    );
} 