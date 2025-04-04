"use client";

import { Compass, Home, LucideIcon, MessageCircle, User, Wallet } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { QRSheet } from "./qr-sheet";

type NavItem = {
    label: string;
    path: string;
    icon: LucideIcon;
    variant?: "default" | "floating";
};

export const BottomNav = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isQRSheetOpen, setIsQRSheetOpen] = useState(false);
    const { data: session } = useSession();

    const navItems: NavItem[] = [
        { label: "Feed", path: "/home", icon: Home },
        { label: "Discover", path: "/discover", icon: Compass },
        { label: "P2P", path: "/p2p", icon: Wallet, variant: "floating" },
        { label: "Chat", path: "/chat", icon: MessageCircle },
        { label: "Profile", path: `/users/${session?.user?.id}`, icon: User },
    ];

    const isActive = (path: string) => pathname === path;

    const handleNavClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        path: string
    ) => {
        e.preventDefault();
        if (path === "/qr") {
            setIsQRSheetOpen(true);
            return;
        }
        if (pathname !== path) {
            router.push(path);
        }
    };

    const renderNavItem = ({ path, label, icon: Icon, variant = "default" }: NavItem) => {
        const styles = {
            default: {
                container: "flex w-full flex-col items-center justify-center space-y-1",
                icon: "relative flex items-center justify-center",
                iconSize: "h-6 w-6 transition-colors"
            },
            floating: {
                container: "flex w-full flex-col items-center justify-center space-y-1 relative -top-5",
                icon: "relative flex items-center justify-center bg-primary rounded-full p-4 shadow-xl hover:bg-primary/90 transition-colors",
                iconSize: "h-7 w-7 transition-colors text-primary-foreground"
            }
        };

        return (
            <Link
                key={path}
                href={path}
                onClick={(e) => handleNavClick(e, path)}
                className={`${styles[variant].container} ${isActive(path) ? "text-foreground" : "text-gray-400"}`}
                tabIndex={0}
            >
                <div className={styles[variant].icon}>
                    <Icon className={styles[variant].iconSize} />
                </div>
                <span className={`text-xs font-medium ${variant === "floating" && "hidden"}`}>
                    {label}
                </span>
            </Link>
        );
    };

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 border-t bg-background">
                <div className="flex h-16 items-center justify-around">
                    {navItems.map((item) => renderNavItem(item))}
                </div>
                <div className="safe-area-spacer" />
            </nav>
            <QRSheet
                isOpen={isQRSheetOpen}
                onClose={() => setIsQRSheetOpen(false)}
            />
        </>
    );
};
