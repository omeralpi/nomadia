import { zodResolver } from "@hookform/resolvers/zod";
import { RiQrCodeLine, RiRefreshLine } from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DefaultLayout } from "./default-layout";
import { PageHeader } from "./page-header";
import { SelectCryptoCurrency } from "./select-crypto-currency";
import { Button } from "./ui/button";
import { Drawer, DrawerContent } from "./ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormSubmitButton } from "./ui/form";
import { Input } from "./ui/input";

const receivePaymentFormSchema = z.object({
    currency: z.string().min(1, "Please select a cryptocurrency"),
    amount: z.number().min(0.000001, "Please enter a valid amount"),
});

type ReceivePaymentFormValues = z.infer<typeof receivePaymentFormSchema>;

interface ReceivePaymentDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ReceivePaymentDrawer = ({ isOpen, onOpenChange }: ReceivePaymentDrawerProps) => {
    const { data: session } = useSession();
    const [qrData, setQrData] = useState<{ currency: string; amount: number } | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const form = useForm<ReceivePaymentFormValues>({
        resolver: zodResolver(receivePaymentFormSchema),
        defaultValues: {
            amount: 0,
        },
    });

    const handleSubmit = async (data: ReceivePaymentFormValues) => {
        if (!session?.user?.id) return;

        setIsGenerating(true);

        await new Promise(resolve => setTimeout(resolve, 1000));
        setQrData(data);
        setIsGenerating(false);
    };

    const resetForm = () => {
        setQrData(null);
        form.reset();
    };

    const qrCodeValue = qrData
        ? JSON.stringify({
            receiptAddress: session?.user?.id,
            currency: qrData.currency,
            amount: qrData.amount
        })
        : "";

    return (
        <Drawer open={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent className="h-[96%]">
                <DefaultLayout>
                    <PageHeader title="Receive Crypto Payment" />
                    <AnimatePresence mode="wait">
                        {!qrData ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pb-20">
                                        <div className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="currency"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Select Cryptocurrency</FormLabel>
                                                        <FormControl>
                                                            <SelectCryptoCurrency
                                                                value={field.value}
                                                                onValueChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="amount"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Amount</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                inputMode="decimal"
                                                                placeholder="Enter amount"
                                                                {...field}
                                                                onChange={(e) => {
                                                                    const value = e.target.value.replace(',', '.');
                                                                    const numberValue = parseFloat(value);
                                                                    field.onChange(isNaN(numberValue) ? 0 : numberValue);
                                                                }}
                                                                className="w-full"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="fixed bottom-0 left-0 right-0 p-4">
                                            <FormSubmitButton type="submit" className="w-full" disabled={isGenerating}>
                                                <RiQrCodeLine className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                                                {isGenerating ? 'Generating QR Code...' : 'Generate QR Code'}
                                            </FormSubmitButton>
                                            <div className="safe-area-spacer" />
                                        </div>
                                    </form>
                                </Form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="qr-code"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.4, type: "spring" }}
                                className="flex flex-col items-center justify-center space-y-6 p-4"
                            >
                                <motion.div
                                    className="bg-white p-6 rounded-2xl shadow-lg"
                                    initial={{ rotate: -10 }}
                                    animate={{ rotate: 0 }}
                                    transition={{ duration: 0.4, type: "spring" }}
                                >
                                    <QRCodeSVG
                                        value={qrCodeValue}
                                        size={250}
                                        level="H"
                                        includeMargin
                                    />
                                </motion.div>

                                <motion.div
                                    className="text-center space-y-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="text-xl font-semibold">
                                        {qrData.amount} {qrData.currency}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Scan this QR code to send payment
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="fixed bottom-0 left-0 right-0 p-4"
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={resetForm}
                                    >
                                        <RiRefreshLine className="w-5 h-5 mr-2" />
                                        Generate New QR Code
                                    </Button>
                                    <div className="safe-area-spacer" />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </DefaultLayout>
            </DrawerContent>
        </Drawer>
    );
}; 