"use client";

import {
    RiAddLine,
    RiChat1Line,
    RiEarthLine,
    RiFileList2Line,
    RiUser3Line
} from '@remixicon/react';
import { useSession } from 'next-auth/react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
    label: string;
    path: string;
    icon: React.ElementType;
    variant?: "default" | "floating";
};

export const BottomNav = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();

    const navItems: NavItem[] = [
        {
            label: "Earth",
            path: "/earth",
            icon: RiEarthLine
        },
        {
            label: "My Listings",
            path: "/my-listings",
            icon: RiFileList2Line
        },
        {
            label: "New Listing",
            path: "/new-listing",
            icon: RiAddLine,
            variant: "floating"
        },
        {
            label: "Messages",
            path: "/chat",
            icon: RiChat1Line
        },
        {
            label: "Profile",
            path: `/users/${session?.user.id}`,
            icon: RiUser3Line
        }
    ];

    const isActive = (path: string) => pathname === path;

    const handleNavClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        path: string
    ) => {
        e.preventDefault();

        if (pathname !== path) {
            router.push(path);
        }
    };

    const renderNavItem = ({ path, label, icon: Icon, variant = "default" }: NavItem) => {
        if (variant === "floating") {
            return (
                <Link
                    key={path}
                    href={path}
                    onClick={(e) => handleNavClick(e, path)}
                    className="relative -translate-y-[10px] flex flex-col items-center justify-center -mt-6 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
                    tabIndex={0}
                >
                    <Icon className="h-6 w-6" />
                </Link>
            );
        }

        return (
            <Link
                key={path}
                href={path}
                onClick={(e) => handleNavClick(e, path)}
                className={`py-3 flex w-full flex-col items-center justify-center space-y-1 relative before:absolute before:top-0 before:h-[3px] before:w-full before:scale-x-0 before:bg-primary before:transition-transform before:duration-200 before:shadow-[0_2px_4px_rgba(var(--primary)/.25)] data-[active=true]:before:scale-x-100 ${isActive(path) ? "text-foreground" : "text-gray-400"}`}
                data-active={isActive(path)}
                tabIndex={0}
            >
                <div className="relative flex items-center justify-center">
                    <Icon className="h-6 w-6 transition-colors" />
                </div>
                <div className="text-xs">{label}</div>
            </Link>
        );
    };

    return (
        <nav className="bg-background/75 backdrop-blur-sm z-10 relative">
            <div className="flex items-center justify-around">
                {navItems.map((item) => renderNavItem(item))}
            </div>
            <div className="safe-area-spacer" />
        </nav>
    );
};
