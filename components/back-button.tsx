import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
    href?: string;
    className?: string;
}

export function BackButton({ href, className }: BackButtonProps) {
    const router = useRouter();

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => {
                if (href) {
                    router.push(href);
                } else {
                    router.back();
                }
            }}
            className={cn(
                "rounded-full",
                className
            )}
        >
            <ChevronLeft className="h-5 w-5" />
        </Button>
    )
}