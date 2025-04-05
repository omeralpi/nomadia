import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ChatMessagesSkeleton() {
    return (
        <div className="flex flex-col gap-4 p-4">
            {Array.from({ length: 6 }).map((_, i) => {
                const isEven = i % 2 === 0;

                return (
                    <div
                        key={i}
                        className={cn(
                            "flex items-end gap-2",
                            isEven ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-2">
                            <div
                                className={cn(
                                    "flex items-center gap-2",
                                    isEven && "flex-row-reverse"
                                )}
                            >
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                            <Skeleton
                                className={cn(
                                    "h-[38px] w-[200px] rounded-lg",
                                    isEven ? "ml-auto" : "mr-auto"
                                )}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
} 