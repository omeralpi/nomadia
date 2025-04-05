import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    action?: ReactNode;
    className?: string;
}

export const PageHeader = ({ title, action, className }: PageHeaderProps) => {
    return (
        <div className={cn("sticky gap-4 top-0 flex justify-between items-center", className)}>
            <Image
                src="/logo.svg"
                alt="Logo"
                width={32}
                height={32}
            />
            <h1 className="flex-1 text-3xl font-bold font-display">{title}</h1>
            {action}
        </div>
    );
}; 