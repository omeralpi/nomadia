"use client";

import { Calendar, Compass, User, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export const BottomNav = () => {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { label: "Events", path: "/events", icon: Calendar },
        { label: "P2P", path: "/p2p", icon: Users },
        { label: "Discover", path: "/discover", icon: Compass },
        { label: "Profile", path: "/profile", icon: User },
    ];

    const isActive = (path: string) => {
        return pathname === path;
    };

    const handleNavClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        path: string
    ) => {
        e.preventDefault();

        if (pathname !== path) {
            router.push(path);
        }
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 border-t">
            <div className="flex h-16 items-center justify-around">
                {navItems.map(({ path, label, icon: Icon }) => (
                    <a
                        key={path}
                        href={path}
                        onClick={(e) => handleNavClick(e, path)}
                        className={`flex w-full flex-col items-center justify-center space-y-1 ${isActive(path) ? "text-foreground" : "text-gray-400"
                            }`}
                        tabIndex={0}
                    >
                        <div className="relative">
                            <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-medium">{label}</span>
                    </a>
                ))}
            </div>
            <div className="safe-area-spacer"></div>
        </nav>
    );
};
