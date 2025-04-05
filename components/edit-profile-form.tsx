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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    image: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    defaultValues: ProfileFormData;
    onSubmit: (data: ProfileFormData) => Promise<void>;
    isSubmitting?: boolean;
}

export function ProfileForm({ defaultValues, onSubmit, isSubmitting }: ProfileFormProps) {
    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues,
    });

    const handleAvatarUpload = (url: string) => {
        form.setValue("image", url);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative pb-24">
                <div className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                        <AvatarUpload
                            currentImage={form.watch("image")}
                            fallback={form.watch("name")?.[0]}
                            onUploadSuccess={handleAvatarUpload}
                            onUploadError={(error) => toast.error(error.message)}
                            size="md"
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

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:relative md:p-0 md:bg-transparent md:border-0 md:mt-6">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                    <div className="safe-area-spacer" />
                </div>
            </form>
        </Form>
    );
} 