"use client";

import { AddressDisplay } from "@/components/address-display";
import { BackButton } from "@/components/back-button";
import { DefaultLayout } from "@/components/default-layout";
import { EmptyState } from "@/components/empty-state";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { formatWLDAmount } from "@/lib/utils";
import { RiHistoryLine } from "@remixicon/react";
import { formatDistanceToNow } from "date-fns";

function TransactionHistorySkeleton() {
    return (
        <div className="container mx-auto py-8">
            <Skeleton className="mb-8 h-9 w-48" />
            <div className="grid gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i}>
                        <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-4">
                                    <Skeleton className="h-8 flex-1" />
                                    <Skeleton className="h-8 flex-1" />
                                </div>
                                <Skeleton className="h-6 w-full" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default function Page() {
    const { data: transactions = [], isLoading } = api.transaction.list.useQuery();

    return (
        <DefaultLayout>
            <div className="space-y-8">
                <div className="relative flex items-center justify-center">
                    <BackButton className="absolute left-0" href="/account" />
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Transaction History</h1>
                    </div>
                </div>
                {
                    isLoading ? (
                        <TransactionHistorySkeleton />
                    ) : transactions.length > 0 ? (
                        <div className="grid gap-4">
                            {transactions.map((transaction) => (
                                <Card key={transaction.transactionId} className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between border-b pb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(transaction.updatedAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <span className="font-medium">
                                                {formatWLDAmount(transaction.inputTokenAmount)} {transaction.inputToken}
                                            </span>
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="flex flex-col gap-2">
                                                <AddressDisplay
                                                    address={transaction.fromWalletAddress}
                                                    label="From"
                                                    className="flex-1"
                                                />
                                                <AddressDisplay
                                                    address={transaction.recipientAddress}
                                                    label="To"
                                                    className="flex-1"
                                                />
                                            </div>
                                            {transaction.transactionHash && (
                                                <AddressDisplay
                                                    address={transaction.transactionHash}
                                                    label="Hash"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : <EmptyState
                        icon={<RiHistoryLine className="h-10 w-10" />}
                        title="No transactions found"
                        description="You haven't made any transactions yet."
                    />
                }
            </div>
        </DefaultLayout>
    );
} 