'use client';

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession()

    useEffect(() => {
        if (status === "unauthenticated") {
            signOut({ callbackUrl: "/" })
        }
    }, [status])

    return (
        <>
            {children}
        </>
    );
}