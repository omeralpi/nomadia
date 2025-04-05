'use client';

import { ListingMap } from "@/components/listing-map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiMapPin2Line, RiSearchLine } from "@remixicon/react";
import { useEffect, useState } from "react";

export default function Page() {
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    }>();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    }, []);

    return (
        <>
            <ListingMap
                className="fixed inset-0"
                currentLocation={location}
                showCurrentLocation={true}
            />
            <div className="absolute inset-x-0 top-0 z-10 px-4 py-4 bg-background backdrop-blur rounded-b-3xl">
                <div className="relative">
                    <RiSearchLine className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground size-[16px]" />
                    <Input className="pl-12 bg-muted rounded-3xl" placeholder="Search location" />
                    <Button
                        size='icon'
                        className="rounded-full absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={() => {
                            if (location) {
                                setLocation({
                                    latitude: location.latitude,
                                    longitude: location.longitude
                                });
                            }
                        }}
                    >
                        <RiMapPin2Line className="size-[16px]" />
                    </Button>
                </div>
            </div>
        </>
    );
}