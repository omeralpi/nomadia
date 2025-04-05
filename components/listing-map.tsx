"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { calculateDistance, cn } from "@/lib/utils";
import { GoogleMap, Marker, MarkerClusterer, OverlayView, useLoadScript } from "@react-google-maps/api";
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
            latitude: currentLocation?.latitude ?? 41.0082,
            longitude: currentLocation?.longitude ?? 28.9784,
            radius: 10,
        },
        {
            enabled: true,
        }
    );

    const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
    const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
    const swiperRef = useRef<SwiperType>();
    const router = useRouter();

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBpuncGy7zgJjz7m-iKvRVEfIN7EXIHP-U"
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

    const center = useMemo(() => {
        if (currentLocation) {
            return {
                lat: currentLocation.latitude,
                lng: currentLocation.longitude,
            };
        }
        return { lat: 0, lng: 0 };
    }, [currentLocation]);

    const handleListingClick = useCallback((listingId: number) => {
        setSelectedListingId(listingId);
        const listing = listings.find(l => l.id === listingId);
        if (listing && mapRef) {
            mapRef.panTo({ lat: Number(listing.latitude), lng: Number(listing.longitude) });
            mapRef.setZoom(16);
            const listingIndex = listings.findIndex(l => l.id === listingId);
            swiperRef.current?.slideTo(listingIndex);
        }
    }, [listings, mapRef]);

    const handleSlideChange = useCallback((swiper: SwiperType) => {
        const listing = listings[swiper.activeIndex];
        if (listing && mapRef) {
            setSelectedListingId(listing.id);
            mapRef.panTo({ lat: Number(listing.latitude), lng: Number(listing.longitude) });
            mapRef.setZoom(16);
        }
    }, [listings, mapRef]);

    const formatDistance = (distance: number) => {
        if (distance < 1) {
            return `${Math.round(distance * 1000)}m`;
        }
        return `${Math.round(distance)}km`;
    };

    if (!isLoaded || isLoading) return <div>Loading maps...</div>;

    return (
        <div className={cn("relative h-full", className)}>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                zoom={14}
                center={center}
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
                <MarkerClusterer
                    options={{
                        imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
                        minimumClusterSize: 2,
                        gridSize: 50,
                    }}
                >
                    {(clusterer) => (
                        <>
                            {listings.map((listing) => (
                                <OverlayView
                                    key={`${listing.id}-${listing.amount}-${listing.currency}`}
                                    position={{ lat: Number(listing.latitude), lng: Number(listing.longitude) }}
                                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                >
                                    <div
                                        className="relative -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                                        onClick={() => handleListingClick(listing.id)}
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="relative">
                                                <div className={cn(
                                                    "h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-background shadow-lg transition-transform",
                                                    selectedListingId === listing.id && "scale-110 border-primary"
                                                )}>
                                                    {listing.user.image ? (
                                                        <img
                                                            src={listing.user.image}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                                                            {listing.user.name?.[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                                                    <div className="h-2 w-2 rounded-full bg-primary shadow" />
                                                </div>
                                            </div>
                                            <div className="mt-1 rounded-full bg-background px-2 py-0.5 text-xs font-medium shadow backdrop-blur-sm">
                                                {listing.user.name}
                                            </div>
                                        </div>
                                    </div>
                                </OverlayView>
                            ))}
                        </>
                    )}
                </MarkerClusterer>
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
                        {listings.map((listing) => {
                            const distance = currentLocation ?
                                calculateDistance(
                                    currentLocation.latitude,
                                    currentLocation.longitude,
                                    Number(listing.latitude),
                                    Number(listing.longitude)
                                ) : null;

                            return (
                                <SwiperSlide key={`${listing.id}-${listing.amount}-${listing.currency}`}>
                                    <div
                                        className="transition-all duration-300"
                                        onClick={() => handleListingClick(listing.id)}
                                    >
                                        <Card className={cn("p-4 transition-transform bg-background/50 backdrop-blur-sm")}>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarImage src={listing.user.image ?? undefined} alt={listing.user.name ?? undefined} />
                                                        <AvatarFallback>{listing.user.name?.[0]}</AvatarFallback>
                                                    </Avatar>
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
                                                            {listing.type === "buying" ? "Buying" : "Selling"} {listing.amount} {listing.currency}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    className="w-full"
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        router.push(`/chat/${listing.user.id}`);
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
        </div>
    );
} 