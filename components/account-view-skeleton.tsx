import { Skeleton } from "@/components/ui/skeleton";

export function AccountViewSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <Skeleton className="size-24 rounded-full" />
                <Skeleton className="size-10 rounded-md" />
            </div>
            <div>
                <div>
                    <Skeleton className="h-7 w-32" />
                    <Skeleton className="h-5 w-48 mt-2" />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    <div className="flex gap-1 items-center">
                        <Skeleton className="h-5 w-4" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                    <div className="flex gap-1 items-center">
                        <Skeleton className="h-5 w-4" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                </div>
                <Skeleton className="h-9 w-24" />
            </div>
        </div>
    );
} 
