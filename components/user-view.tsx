"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { User } from "@/lib/db/schema";
import { LogOut, MessageCircle, MoreVertical, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserViewProps {
    user: User;
}

export function UserView({ user }: UserViewProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const isOwnProfile = session?.user?.id === user.id;

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <Avatar className="size-24">
                    <AvatarImage src={user.image ?? ""} />
                    <AvatarFallback>
                        {user.name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setIsOpen(true)}
                    >
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                )}
            </div>
            <div className="flex justify-between">
                <div>
                    <div className="text-lg font-bold">{user.name ?? "Anonymous"}</div>
                    <div className="text-muted-foreground">{user.bio ?? "No bio yet"}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {!isOwnProfile && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/chat/${user.id}`)}
                        >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Message
                        </Button>
                    )}
                    {isOwnProfile && (
                        <Button
                            variant="outline"
                            className="rounded-full"
                            size="sm"
                            onClick={() => router.push("/edit-profile")}
                        >
                            Edit Profile
                        </Button>
                    )}
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between">
                <div className="flex gap-4">
                    <div className="flex gap-1">
                        <b>0</b>
                        <span className="text-muted-foreground">Followers</span>
                    </div>
                    <div className="flex gap-1">
                        <b>0</b>
                        <span className="text-muted-foreground">Following</span>
                    </div>
                </div>
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent side="bottom" className="p-0 pb-14">
                    <SheetHeader className="p-6 pb-0">
                        <SheetTitle>Profile Actions</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                        <div
                            role="button"
                            className="flex items-center w-full px-6 py-3 hover:opacity-80 transition-colors cursor-pointer"
                            onClick={() => {
                                setIsOpen(false);
                            }}
                        >
                            <Settings className="mr-3 h-4 w-4" />
                            <span>Settings</span>
                        </div>
                        <div
                            role="button"
                            className="flex items-center w-full px-6 py-3 text-destructive hover:opacity-80 transition-colors cursor-pointer"
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            <LogOut className="mr-3 h-4 w-4" />
                            <span>Logout</span>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
} 