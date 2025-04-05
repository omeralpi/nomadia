"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RiHistoryLine, RiLogoutCircleLine, RiSettings2Line } from "@remixicon/react";
import { ChevronRight } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { DefaultLayout } from "./default-layout";
import { PageHeader } from "./page-header";

export function AccountView() {
    const { data: session } = useSession();

    const menu = [
        {
            label: "Account Settings",
            href: "/account-settings",
            icon: RiSettings2Line
        },
        {
            label: "Transaction History",
            href: "/transaction-history",
            icon: RiHistoryLine
        },
        {
            label: "Sign Out",
            onClick: () => {
                signOut();
            },
            icon: RiLogoutCircleLine
        }
    ]

    return (
        <DefaultLayout>
            <PageHeader title="Account" />
            <div className="space-y-8">
                <Link href="/edit-profile" className="flex items-center gap-4">
                    <Avatar className="size-12">
                        <AvatarImage src={session?.user?.image ?? ""} />
                        <AvatarFallback>
                            {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <div className="font-medium">{session?.user?.name}</div>
                        <div
                            className="text-sm flex items-center gap-2 text-muted-foreground"
                        >
                            Edit Profile
                            <ChevronRight className="h-4 w-4" />
                        </div>
                    </div>
                </Link>
                <div className="space-y-6">
                    <div className="text-muted-foreground text-sm font-medium">
                        Preferences
                    </div>
                    {
                        menu.map((item) => {
                            if (item.onClick) {
                                return (
                                    <div onClick={item.onClick} key={item.label} className="font-semibold text-lg flex items-center gap-4">
                                        <item.icon className="size-6 text-muted-foreground/50" />
                                        {item.label}
                                    </div>
                                )
                            }

                            return (
                                <Link href={item.href} key={item.label} className="font-semibold text-lg flex items-center gap-4">
                                    <item.icon className="size-6 text-muted-foreground/50" />
                                    {item.label}
                                </Link>
                            )
                        })
                    }
                </div>
            </div>

            <div className="flex items-center gap-2 justify-center absolute bottom-[100px] left-0 right-0">
                <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={64}
                    height={64}
                />
                <span className="text-sm text-muted-foreground">Version 1.0.0</span>
            </div>
        </DefaultLayout>
    );
} 