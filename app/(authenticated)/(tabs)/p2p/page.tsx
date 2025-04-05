'use client';

import { CitySearch } from "@/components/city-search";
import { ListingMap } from "@/components/listing-map";
import { QrDrawer } from "@/components/qr-drawer";
import { Button } from "@/components/ui/button";
import { RiMapPin2Line, RiQrCodeLine } from "@remixicon/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    }>();
    const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

    const { data: session, status } = useSession();

    const router = useRouter();

    useEffect(() => {
        if (session?.user.address && !session.user.name) {
            router.push("/complete-profile");
        }
    }, [session]);

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

    const handleCitySelect = (city: { latitude: number; longitude: number }) => {
        if (mapRef) {
            mapRef.panTo({
                lat: city.latitude,
                lng: city.longitude
            });
            mapRef.setZoom(12);
        }
    };

    return (
        <>
            <ListingMap
                className="fixed inset-0"
                currentLocation={location}
                showCurrentLocation={true}
                onMapLoad={setMapRef}
            />
            <div className="absolute inset-x-0 top-0 z-10 px-4 py-4 rounded-b-3xl flex gap-4 items-center">
                <div className="relative flex-1">
                    <CitySearch onCitySelect={handleCitySelect} />
                    <div className="absolute top-0 right-0 h-full flex justify-center items-center px-3">
                        <Button
                            size='icon'
                            className="rounded-full"
                            onClick={() => {
                                if (location && mapRef) {
                                    mapRef.panTo({
                                        lat: location.latitude,
                                        lng: location.longitude
                                    });
                                    mapRef.setZoom(15);
                                }
                            }}
                        >
                            <RiMapPin2Line className="size-[16px]" />
                        </Button>
                    </div>
                </div>
                <QrDrawer>
                    <Button
                        size="icon"
                        className="rounded-full [&_svg]:size-8 size-14"
                    >
                        <RiQrCodeLine />
                    </Button>
                </QrDrawer>
            </div>
        </>
    );
}