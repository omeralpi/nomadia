'use client';

import { PageHeader } from "@/components/page-header";

export default function Page() {
    return (
        <div className="px-4">
            <div className="flex gap-3 py-4 items-center">
                <PageHeader title="My Listings" />
            </div>
        </div>
    );
}