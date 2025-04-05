"use client";

import { ListingAvatar } from "@/components/listing-avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { calculateDistance, cn } from "@/lib/utils";
import { GoogleMap, Marker, OverlayView, useLoadScript } from "@react-google-maps/api";
import { MessageCircleIcon, Navigation } from "lucide-react";
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
}

export function ListingMap({ className, currentLocation, showCurrentLocation }: ListingMapProps) {
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
                onLoad={map => setMapRef(map)}
            >
                <div className="absolute right-4 top-4">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-background shadow-md"
                        onClick={() => {
                            if (currentLocation && mapRef) {
                                mapRef.panTo({
                                    lat: currentLocation.latitude,
                                    lng: currentLocation.longitude
                                });
                                mapRef.setZoom(15);
                            }
                        }}
                    >
                        <Navigation className="h-5 w-5" />
                    </Button>
                </div>

                {showCurrentLocation && currentLocation && (
                    <Marker
                        position={{
                            lat: currentLocation.latitude,
                            lng: currentLocation.longitude,
                        }}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: "#3B82F6",
                            fillOpacity: 1,
                            strokeColor: "#FFFFFF",
                            strokeWeight: 2,
                        }}
                    />
                )}
                {sortedListings.map((listing) => (
                    <OverlayView
                        key={`${listing.id}-${listing.amount}-${listing.currencyCode}`}
                        position={{ lat: Number(listing.latitude), lng: Number(listing.longitude) }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        <div
                            className="relative -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                            onClick={() => handleListingClick(listing.id)}
                        >
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <ListingAvatar
                                        listing={listing}
                                        selected={selectedListingId === listing.id}
                                    />
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                                        <div className="h-2 w-2 rounded-full bg-primary shadow" />
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
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <div className="font-medium">{listing.user.name}</div>
                                                            {distance && (
                                                                <div className="text-xs text-muted-foreground">
                                                                    {formatDistance(distance)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {listing.type === "buying" ? "Buying" : "Selling"} {listing.amount} {listing.currencyCode}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    className="w-full"
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        router.push(`/chat/${listing.user.id}?userName=${listing.user.name}&userImage=${listing.user.image}`);
                                                    }}
                                                >
                                                    Send Message
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