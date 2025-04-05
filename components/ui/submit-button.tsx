import { Loader2 } from "lucide-react";
import { Button } from "./button";

export function SubmitButton({ children, disabled, isSubmitting, ...props }: React.ComponentProps<typeof Button> & {
    isSubmitting?: boolean;
}) {
    return <Button {...props} disabled={disabled || isSubmitting}>
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </Button>
}