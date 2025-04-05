"use client";

import { ListingAvatar } from "@/components/listing-avatar";
import { ListingTypeBadge } from "@/components/listing-type-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { calculateDistance, cn, formatAmount } from "@/lib/utils";
import { GoogleMap, OverlayView, useLoadScript } from "@react-google-maps/api";
import { MessageCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";

interface ListingMapProps {
    className?: string;
    currentLocation?: {
        latitude: number;
        longitude: number;
    };
    showCurrentLocation?: boolean;
    onMapLoad?: (map: google.maps.Map) => void;
}

export function ListingMap({ className, currentLocation, showCurrentLocation, onMapLoad }: ListingMapProps) {
    const { data: listings = [], isLoading } = api.listing.nearby.useQuery(
        {
            latitude: currentLocation?.latitude ?? 0,
            longitude: currentLocation?.longitude ?? 0,
        },
        {
            enabled: true,
        }
    );

    const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
    const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
    const swiperRef = useRef<SwiperType | null>(null);
    const router = useRouter();
    const { data: session } = useSession();

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
    });

    const options = useMemo(() => ({
        disableDefaultUI: true,
        clickableIcons: false,
        gestureHandling: "greedy",
        styles: [
            {
                elementType: "geometry",
                stylers: [{ color: "#242f3e" }]
            },
            {
                elementType: "labels.text.stroke",
                stylers: [{ color: "#242f3e" }]
            },
            {
                elementType: "labels.text.fill",
                stylers: [{ color: "#746855" }]
            },
            {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }]
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }]
            },
            {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }]
            },
            {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9ca5b3" }]
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#746855" }]
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#1f2835" }]
            },
            {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#f3d19c" }]
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }]
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#515c6d" }]
            },
            {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#17263c" }]
            },
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "transit",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "business",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "landscape.man_made",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    }), []);

    const sortedListings = useMemo(() => {
        if (!currentLocation) return listings;

        return [...listings].sort((a, b) => {
            const distanceA = calculateDistance(
                currentLocation.latitude,
                currentLocation.longitude,
                Number(a.latitude),
                Number(a.longitude)
            );
            const distanceB = calculateDistance(
                currentLocation.latitude,
                currentLocation.longitude,
                Number(b.latitude),
                Number(b.longitude)
            );
            return distanceA - distanceB;
        });
    }, [listings, currentLocation]);

    const mapCenter = useMemo(() => {
        if (currentLocation) {
            return {
                lat: currentLocation.latitude,
                lng: currentLocation.longitude,
            };
        }

        if (sortedListings.length > 0) {
            return {
                lat: Number(sortedListings[0].latitude),
                lng: Number(sortedListings[0].longitude),
            };
        }

        return { lat: 0, lng: 0 };
    }, [currentLocation, sortedListings]);

    const handleListingClick = useCallback((listingId: number) => {
        setSelectedListingId(listingId);
        const listing = sortedListings.find(l => l.id === listingId);
        if (listing && mapRef) {
            mapRef.panTo({ lat: Number(listing.latitude), lng: Number(listing.longitude) });
            mapRef.setZoom(16);
            const listingIndex = sortedListings.findIndex(l => l.id === listingId);
            swiperRef.current?.slideTo(listingIndex);
        }
    }, [sortedListings, mapRef]);

    const handleSlideChange = useCallback((swiper: SwiperType) => {
        const listing = sortedListings[swiper.activeIndex];
        if (listing && mapRef) {
            setSelectedListingId(listing.id);
            mapRef.panTo({ lat: Number(listing.latitude), lng: Number(listing.longitude) });
            mapRef.setZoom(16);
        }
    }, [sortedListings, mapRef]);

    const formatDistance = (distance: number) => {
        if (distance < 1) {
            return `${Math.round(distance * 1000)} m`;
        }
        return `${Math.round(distance)} km`;
    };

    if (!isLoaded || isLoading) return <div></div>;

    return (
        <div className={cn("relative h-full", className)}>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                zoom={currentLocation ? 14 : 2}
                center={mapCenter}
                options={options}

                onLoad={map => {
                    setMapRef(map);
                    onMapLoad?.(map);
                }}
            >
                {showCurrentLocation && currentLocation && (
                    <>
                        <OverlayView
                            position={{
                                lat: currentLocation.latitude,
                                lng: currentLocation.longitude,
                            }}
                            mapPaneName={OverlayView.FLOAT_PANE}
                        >
                            <div className="relative -translate-x-1/2 -translate-y-1/2">
                                <div className="absolute -inset-6">
                                    <div className="h-12 w-12 rounded-full bg-primary/30 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
                                </div>
                                <div className="absolute -inset-10">
                                    <div className="h-20 w-20 rounded-full bg-primary/20 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                                </div>
                                <div className="absolute -inset-14">
                                    <div className="h-28 w-28 rounded-full bg-primary/10 animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                                </div>
                                <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                                    <div className="h-8 w-8 rounded-full bg-primary border-[3px] border-white shadow-lg" />
                                </div>
                            </div>
                        </OverlayView>
                    </>
                )}
                {sortedListings.map((listing) => (
                    <OverlayView
                        key={`${listing.id}-${listing.amount}-${listing.currencyCode}`}
                        position={{ lat: Number(listing.latitude), lng: Number(listing.longitude) }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        <div
                            className="relative -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                            onClick={() => handleListingClick(listing.id)}
                        >
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <div className="flex justify-center">
                                        <ListingTypeBadge type={listing.type} />
                                    </div>
                                    <ListingAvatar
                                        listing={listing}
                                        selected={selectedListingId === listing.id}
                                    />
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                                        <div className={cn(
                                            "h-2 w-2 rounded-full shadow",
                                            listing.type === "buying"
                                                ? "bg-blue-500"
                                                : "bg-green-500"
                                        )} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </OverlayView>
                ))}
            </GoogleMap>

            <div className="absolute bottom-[125px] left-0 right-0">
                <div className="overflow-hidden">
                    <Swiper
                        onBeforeInit={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        onSlideChange={handleSlideChange}
                        slidesPerView={1.25}
                        centeredSlides={true}
                        spaceBetween={16}
                        grabCursor={true}
                    >
                        {sortedListings.map((listing) => {
                            const distance = currentLocation ?
                                calculateDistance(
                                    currentLocation.latitude,
                                    currentLocation.longitude,
                                    Number(listing.latitude),
                                    Number(listing.longitude)
                                ) : null;

                            return (
                                <SwiperSlide key={`${listing.id}-${listing.amount}-${listing.currencyCode}`}>
                                    <div
                                        className="transition-all duration-300"
                                        onClick={() => handleListingClick(listing.id)}
                                    >
                                        <Card className={cn("p-4 transition-transform bg-background/50 backdrop-blur-sm")}>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-3">
                                                    <ListingAvatar
                                                        listing={listing}
                                                    />
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <div className="font-medium">{listing.user.name || "Anonymous"}</div>
                                                            {distance && (
                                                                <div className="text-xs text-muted-foreground">
                                                                    {formatDistance(distance)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <ListingTypeBadge type={listing.type} />
                                                            <span className="text-muted-foreground text-sm font-medium font-display">
                                                                {formatAmount(listing.amount)} {listing.currencyCode}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    className="w-full"
                                                    disabled={listing.user.id === session?.user.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        const defaultMessage = listing.type === "buying"
                                                            ? `Hey, I'm interested in selling ${listing.amount} ${listing.currencyCode}`
                                                            : `Hey, I'm interested in buying ${listing.amount} ${listing.currencyCode}`;

                                                        router.push(`/chat/${listing.user.id}?userName=${listing.user.name}&userImage=${listing.user.image}&initialMessage=${encodeURIComponent(defaultMessage)}`);
                                                    }}
                                                >
                                                    {listing.user.id === session?.user.id ? "Your Listing" : "Send Message"}
                                                    <MessageCircleIcon className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
        </div >
    );
} 