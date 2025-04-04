import { BottomNav } from "@/components/bottom-nav";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div>
        {children}
        <BottomNav />
    </div>;
}