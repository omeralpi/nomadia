"use client";

import { UserView } from "@/components/user-view";
import { UserViewSkeleton } from "@/components/user-view-skeleton";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams();
    const userId = params.userId as string;

    const { data: user, isLoading } = api.user.get.useQuery(
        { id: userId },
        { enabled: !!userId }
    );

    if (isLoading) {
        return (
            <main className="p-6">
                <UserViewSkeleton />
            </main>
        );
    }

    if (!user) {
        return (
            <main className="p-6">
                <div className="text-center text-muted-foreground">User not found</div>
            </main>
        );
    }

    return (
        <main className="p-6">
            <UserView user={user} />
        </main>
    );
}