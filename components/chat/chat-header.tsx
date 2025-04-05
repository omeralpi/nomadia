import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface ChatHeaderProps {
    name: string;
    image?: string | null;
    status?: string;
}

export function ChatHeader({ name, image, status }: ChatHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="flex items-center gap-4 border-b bg-background p-4">
            <Button
                variant="outline"
                size="icon"
                onClick={() => router.push("/chat")}
                className="rounded-full"
            >
                <ChevronLeft className="h-5 w-5" />
            </Button>
            <UserAvatar
                src={image}
                fallback={name[0]}
                className="h-8 w-8"
            />
            <div className="flex-1">
                <div className="font-medium">{name}</div>
                {status && (
                    <div className="text-xs text-muted-foreground">
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
} 