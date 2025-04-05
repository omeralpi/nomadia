"use client";

import { AvatarUpload } from "@/components/avatar-upload";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    image: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function CompleteProfile() {
    const router = useRouter();
    const { update } = useSession();
    const utils = api.useUtils();

    const updateProfile = api.auth.updateUser.useMutation({
        onSuccess: async () => {
            toast.success("Profile saved successfully");
            await Promise.all([
                utils.user.get.invalidate(),
                update({ trigger: "update" })
            ]);
            router.push("/p2p");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            image: "",
        },
    });

    const handleSubmit = async (data: ProfileFormData) => {
        await updateProfile.mutateAsync(data);
    };

    const handleAvatarUpload = (url: string) => {
        form.setValue("image", url);
    };

    return (
        <main className="container max-w-2xl mx-auto p-6">
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">Your Profile</h1>
                    <p className="text-muted-foreground">
                        Introduce yourself to others in your events.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                        <div className="space-y-6">
                            <div className="flex flex-col items-center space-y-4">
                                <AvatarUpload
                                    currentImage={form.watch("image")}
                                    fallback={form.watch("name")?.[0]}
                                    onUploadSuccess={handleAvatarUpload}
                                    onUploadError={(error) => toast.error(error.message)}
                                    size="lg"
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={updateProfile.isPending}
                        >
                            {updateProfile.isPending ? "Saving..." : "Save Profile"}
                        </Button>
                    </form>
                </Form>
            </div>
        </main>
    );
} 