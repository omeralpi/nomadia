"use client";

import {
    RiAddLine,
    RiChat1Line,
    RiEarthLine,
    RiFileList2Line,
    RiUser3Line
} from '@remixicon/react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreateListingDrawer } from "./create-listing-drawer";

type NavItem = {
    label: string;
    path: string;
    icon: React.ElementType;
};

export const BottomNav = () => {
    const pathname = usePathname();

    const navItems: NavItem[] = [
        {
            label: "P2P",
            path: "/p2p",
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
        },
        {
            label: "Messages",
            path: "/chat",
            icon: RiChat1Line
        },
        {
            label: "Account",
            path: `/account`,
            icon: RiUser3Line
        }
    ];

    const isActive = (path: string) => pathname === path;

    const renderNavItem = ({ path, label, icon: Icon }: NavItem) => {
        if (label === "New Listing") {
            return (
                <CreateListingDrawer>
                    <div
                        className="relative -translate-y-[10px] flex flex-col items-center justify-center -mt-6 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
                        tabIndex={0}
                    >
                        <Icon className="h-6 w-6" />
                    </div>
                </CreateListingDrawer>
            );
        }

        return (
            <Link
                key={path}
                href={path}
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
        <>
            <nav className="bg-background/75 backdrop-blur-sm z-10 relative">
                <div className="flex items-center justify-around">
                    {navItems.map((item) => renderNavItem(item))}
                </div>
                <div className="safe-area-spacer" />
            </nav>
        </>
    );
};
