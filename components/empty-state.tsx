import { cn } from "@/lib/utils";

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    className?: string;
    action?: React.ReactNode;
}

export function EmptyState({
    title,
    description,
    icon,
    className,
    action
}: EmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center text-center p-8 gap-3 h-full",
            className
        )}>
            {icon && (
                <div className="text-muted-foreground mb-2 size-20 flex items-center justify-center rounded-full bg-muted [&_svg]:size-8">
                    {icon}
                </div>
            )}
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">{title}</h3>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </div>
            {action && (
                <div className="mt-4">
                    {action}
                </div>
            )}
        </div>
    );
} 