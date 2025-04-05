import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
    href: string;
}

export function BackButton({ href }: BackButtonProps) {
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
            className="rounded-full"
        >
            <ChevronLeft className="h-5 w-5" />
        </Button>
    )
}