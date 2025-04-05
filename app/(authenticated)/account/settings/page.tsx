"use client";

import { AddressDisplay } from "@/components/address-display";
import { BackButton } from "@/components/back-button";
import { DefaultLayout } from "@/components/default-layout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const { data: session } = useSession();

    return (
        <DefaultLayout>
            <div className="space-y-8">
                <div className="relative flex items-center justify-center">
                    <BackButton className="absolute left-0" href="/account" />
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Account Settings</h1>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="text-muted-foreground text-sm font-medium">
                        World Identity
                    </div>

                    {session?.user.address && (
                        <AddressDisplay
                            address={session.user.address}
                            label="Wallet Address"
                            className="py-2"
                        />
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
} 