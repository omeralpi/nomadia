import { UserAvatar } from "@/components/user-avatar";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import { BackButton } from "../back-button";

export function ChatHeader() {
    const params = useParams();
    const userId = params.userId as string;

    const { data: user, isLoading: isLoadingUser, isSuccess: isSuccessUser } = api.user.getById.useQuery({ id: userId });

    return (
        <div className="flex items-center gap-4 border-b bg-background p-4">
            <BackButton href="/chat" />
            {
                isLoadingUser ? (
                    <ChatHeaderSkeleton />
                ) : isSuccessUser ? (
                    <div className="flex items-center gap-2">
                        <UserAvatar
                            src={user.image}
                            fallback={user.name}
                            className="h-8 w-8"
                        />
                        <div className="flex-1">
                            <div className="font-medium">{user.name}</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1">
                        <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
                    </div>
                )
            }
        </div>
    );
}

export function ChatHeaderSkeleton() {
    return (
        <div className="flex items-center gap-4">
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
            <div className="flex-1">
                <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
            </div>
        </div>
    );
}
