'use client';

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { RiQrScanLine, RiWalletLine } from "@remixicon/react";

interface QrDrawerProps {
    children: React.ReactNode;
}

export const QrDrawer = ({ children }: QrDrawerProps) => {
    return (
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
                    >
                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <RiWalletLine className="text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div>Receive Payment</div>
                            <div className="text-sm text-muted-foreground">In any currency pair</div>
                        </div>
                    </Button>
                    <Button
                        variant={'outline'}
                        className="gap-4 text-left h-auto py-4 rounded-xl [&_svg]:size-6"
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
    );
}; 