import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface AddressDisplayProps {
    address: string;
    label?: string;
    className?: string;
}

export function AddressDisplay({ address, label, className }: AddressDisplayProps) {
    const truncateAddress = (addr: string) => {
        if (!addr) return "";
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(address);
        toast.success("Address copied to clipboard");
    };

    return (
        <div className={`flex items-center justify-between rounded-xl bg-muted px-3 py-1.5 gap-2 ${className}`}>
            {label && (
                <div className="text-sm text-muted-foreground">
                    {label}
                </div>
            )}
            <div className="flex items-center gap-1.5">
                <div className="text-sm font-medium">
                    {truncateAddress(address)}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-background"
                    onClick={copyToClipboard}
                >
                    <Copy className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
} 