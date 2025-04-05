import { BottomNav } from "@/components/bottom-nav";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="relative flex-1">
                {children}
            </div>
            <BottomNav />
        </div>
    );
}