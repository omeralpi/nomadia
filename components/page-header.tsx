import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    action?: ReactNode;
    className?: string;
}

export const PageHeader = ({ title, action, className }: PageHeaderProps) => {
    return (
        <div className={cn("sticky top-0 flex justify-between items-center", className)}>
            <h1 className="text-3xl font-bold font-display">{title}</h1>
            {action}
        </div>
    );
}; 