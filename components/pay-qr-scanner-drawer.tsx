'use client';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { api } from "@/lib/api";
import { MiniKit, PayCommandInput, Tokens, tokenToDecimals } from "@worldcoin/minikit-js";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";

interface PayQrScannerDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const PayQrScannerDrawer = ({ isOpen, onOpenChange }: PayQrScannerDrawerProps) => {
    const generateNonce = api.payment.generateNonce.useMutation();
    const confirmPayment = api.payment.confirmPayment.useMutation();

    const sendPayment = async (recipientAddress: string, selectedToken: Tokens, amount: number) => {
        try {
            const nonce = await generateNonce.mutateAsync();

            const payload: PayCommandInput = {
                reference: nonce.id,
                to: recipientAddress,
                tokens: [
                    {
                        symbol: selectedToken,
                        token_amount: tokenToDecimals(amount, selectedToken).toString(),
                    },
                ],
                description: "P2P Transaction",
            };
            if (MiniKit.isInstalled()) {
                return await MiniKit.commandsAsync.pay(payload);
            }
            return null;
        } catch (error: unknown) {
            console.log("Error sending payment", error);
            return null;
        }
    };

    const handlePay = async (
        recipientAddress: string,
        selectedToken: Tokens,
        amount: number,
        setStatus: (status: string | null) => void
    ) => {
        if (!MiniKit.isInstalled()) {
            setStatus("MiniKit is not installed");
            return;
        }

        setStatus("Processing payment...");

        const sendPaymentResponse = await sendPayment(recipientAddress, selectedToken, amount);
        const response = sendPaymentResponse?.finalPayload;

        console.log({ sendPaymentResponse })
        if (!response) {
            setStatus("Payment failed");
            return;
        }

        if (response.status == "success") {
            const res = await confirmPayment.mutateAsync({ payload: response });

            if (res.success) {
                setStatus("P2P Transaction");
            } else {
                setStatus("Payment confirmation failed");
            }
        } else {
            setStatus("Payment failed");
        }
    };

    const handleScan = (detectedCodes: IDetectedBarcode[]) => {
        if (detectedCodes.length > 0) {
            const qrData = JSON.parse(detectedCodes[0].rawValue);

            onOpenChange(false);

            handlePay(qrData.receiptAddress, Tokens.WLD, qrData.amount, (status) => {
                console.log(status);
            });
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent className="pb-16 h-[90%]">
                <DrawerHeader>
                    <DrawerTitle className="text-center">Scan QR Code</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                    <Scanner
                        onScan={handleScan}
                        classNames={{
                            container: "w-full aspect-square rounded-xl",
                            video: "rounded-xl"
                        }}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    );
}; 