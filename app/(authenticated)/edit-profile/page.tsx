"use client";

import { ProfileForm, type ProfileFormData } from "@/components/edit-profile-form";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
    const router = useRouter();
    const { data: session, update } = useSession();
    const utils = api.useUtils();

    const updateProfile = api.auth.updateUser.useMutation({
        onSuccess: async () => {
            toast.success("Profile updated successfully");
            await Promise.all([
                utils.user.get.invalidate(),
                update({ trigger: "update" })
            ]);
            router.back();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleSubmit = async (data: ProfileFormData) => {
        await updateProfile.mutateAsync(data);
    };

    return (
        <main className="container max-w-2xl mx-auto p-6 pb-32">
            <div className="space-y-6">
                <div className="relative flex items-center justify-center">
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-0 rounded-full"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Edit Profile</h1>
                    </div>
                </div>

                <ProfileForm
                    defaultValues={{
                        name: session?.user?.name ?? "",
                        bio: session?.user?.bio ?? "",
                        image: session?.user?.image ?? "",
                    }}
                    onSubmit={handleSubmit}
                    isSubmitting={updateProfile.isPending}
                />
            </div>
        </main>
    );
} 