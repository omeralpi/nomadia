'use client';

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { RiQrScanLine, RiWalletLine } from "@remixicon/react";
import { useState } from "react";
import { PayQrScannerDrawer } from "./pay-qr-scanner-drawer";
import { ReceivePaymentDrawer } from "./receive-payment-drawer";

interface QrDrawerProps {
    children: React.ReactNode;
}

export const QrDrawer = ({ children }: QrDrawerProps) => {
    const [isReceiveDrawerOpen, setIsReceiveDrawerOpen] = useState(false);
    const [isPayDrawerOpen, setIsPayDrawerOpen] = useState(false);

    return (
        <>
            <Drawer>
                <DrawerTrigger asChild>
                    {children}
                </DrawerTrigger>
                <DrawerContent className="pb-16">
                    <DrawerHeader>
                        <DrawerTitle className="text-center">QR Actions</DrawerTitle>
                    </DrawerHeader>
                    <div className="flex flex-col gap-4 p-4">
                        <Button
                            variant={'outline'}
                            className="gap-4 text-left h-auto py-4 rounded-xl [&_svg]:size-6"
                            onClick={() => setIsReceiveDrawerOpen(true)}
                        >
                            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <RiWalletLine className="text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div>Receive Crypto Payment</div>
                                <div className="text-sm text-muted-foreground">In any crypto currency pair</div>
                            </div>
                        </Button>
                        <Button
                            variant={'outline'}
                            className="gap-4 text-left h-auto py-4 rounded-xl [&_svg]:size-6"
                            onClick={() => setIsPayDrawerOpen(true)}
                        >
                            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <RiQrScanLine className="text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div>Pay</div>
                                <div className="text-sm text-muted-foreground">Scan QR Code</div>
                            </div>
                        </Button>
                    </div>
                </DrawerContent>
            </Drawer>

            <ReceivePaymentDrawer
                isOpen={isReceiveDrawerOpen}
                onOpenChange={setIsReceiveDrawerOpen}
            />

            <PayQrScannerDrawer
                isOpen={isPayDrawerOpen}
                onOpenChange={setIsPayDrawerOpen}
            />
        </>
    );
}; 