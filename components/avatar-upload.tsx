"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/lib/utils/upload";
import { Camera, Loader2 } from "lucide-react";
import { useState } from "react";

interface AvatarUploadProps {
    currentImage?: string | null;
    fallback?: string;
    onUploadSuccess: (url: string) => void;
    onUploadError: (error: Error) => void;
    size?: "sm" | "md" | "lg";
}

const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
} as const;

export function AvatarUpload({
    currentImage,
    fallback,
    onUploadSuccess,
    onUploadError,
    size = "md",
}: AvatarUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleFileUpload = async (file: File) => {
        try {
            setIsUploading(true);
            const url = await uploadFile(file);
            onUploadSuccess(url);
        } catch (error) {
            onUploadError(error instanceof Error ? error : new Error("Upload failed"));
            setPreviewImage(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            await handleFileUpload(file);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('avatar-upload')?.click();
    };

    const displayImage = previewImage || currentImage;

    return (
        <div className="relative group">
            <Avatar
                className={`cursor-pointer transition-opacity group-hover:opacity-80 ${sizeClasses[size]}`}
                onClick={triggerFileInput}
            >
                <AvatarImage src={displayImage ?? ""} />
                <AvatarFallback>{fallback}</AvatarFallback>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isUploading ? (
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                    ) : (
                        <Camera className="h-6 w-6 text-white" />
                    )}
                </div>
            </Avatar>
            <label
                htmlFor="avatar-upload"
                className={cn(
                    "absolute bottom-0 right-0 p-1 rounded-full bg-primary hover:bg-primary/90 cursor-pointer transition-colors",
                    isUploading && "pointer-events-none opacity-50"
                )}
            >
                <Camera className="h-4 w-4 text-primary-foreground" />
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={isUploading}
                />
            </label>
        </div>
    );
} 