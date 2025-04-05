'use client';

import { RiCloseLine, RiSearchLine } from "@remixicon/react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface City {
    name: string;
    latitude: number;
    longitude: number;
}

const CITIES: City[] = [
    // East Asia
    { name: "Tokyo", latitude: 35.6762, longitude: 139.6503 },
    { name: "Shanghai", latitude: 31.2304, longitude: 121.4737 },
    { name: "Seoul", latitude: 37.5665, longitude: 126.9780 },
    { name: "Beijing", latitude: 39.9042, longitude: 116.4074 },
    { name: "Hong Kong", latitude: 22.3193, longitude: 114.1694 },
    { name: "Taipei", latitude: 25.0330, longitude: 121.5654 },
    { name: "Osaka", latitude: 34.6937, longitude: 135.5023 },
    { name: "Shenzhen", latitude: 22.5431, longitude: 114.0579 },
    { name: "Guangzhou", latitude: 23.1291, longitude: 113.2644 },

    // Southeast Asia
    { name: "Singapore", latitude: 1.3521, longitude: 103.8198 },
    { name: "Bangkok", latitude: 13.7563, longitude: 100.5018 },
    { name: "Jakarta", latitude: -6.2088, longitude: 106.8456 },
    { name: "Kuala Lumpur", latitude: 3.1390, longitude: 101.6869 },
    { name: "Ho Chi Minh City", latitude: 10.8231, longitude: 106.6297 },
    { name: "Manila", latitude: 14.5995, longitude: 120.9842 },

    // South Asia
    { name: "Mumbai", latitude: 19.0760, longitude: 72.8777 },
    { name: "Delhi", latitude: 28.6139, longitude: 77.2090 },
    { name: "Bangalore", latitude: 12.9716, longitude: 77.5946 },
    { name: "Dhaka", latitude: 23.8103, longitude: 90.4125 },

    // Middle East
    { name: "Dubai", latitude: 25.2048, longitude: 55.2708 },
    { name: "Abu Dhabi", latitude: 24.4539, longitude: 54.3773 },
    { name: "Doha", latitude: 25.2867, longitude: 51.5333 },
    { name: "Istanbul", latitude: 41.0082, longitude: 28.9784 },

    // Europe
    { name: "London", latitude: 51.5074, longitude: -0.1278 },
    { name: "Paris", latitude: 48.8566, longitude: 2.3522 },
    { name: "Moscow", latitude: 55.7558, longitude: 37.6173 },
    { name: "Berlin", latitude: 52.5200, longitude: 13.4050 },
    { name: "Madrid", latitude: 40.4168, longitude: -3.7038 },
    { name: "Rome", latitude: 41.9028, longitude: 12.4964 },
    { name: "Amsterdam", latitude: 52.3676, longitude: 4.9041 },

    // North America
    { name: "New York", latitude: 40.7128, longitude: -74.0060 },
    { name: "Los Angeles", latitude: 34.0522, longitude: -118.2437 },
    { name: "Chicago", latitude: 41.8781, longitude: -87.6298 },
    { name: "Toronto", latitude: 43.6532, longitude: -79.3832 },
    { name: "San Francisco", latitude: 37.7749, longitude: -122.4194 },
    { name: "Mexico City", latitude: 19.4326, longitude: -99.1332 },

    // South America
    { name: "São Paulo", latitude: -23.5505, longitude: -46.6333 },
    { name: "Buenos Aires", latitude: -34.6037, longitude: -58.3816 },
    { name: "Rio de Janeiro", latitude: -22.9068, longitude: -43.1729 },
    { name: "Santiago", latitude: -33.4489, longitude: -70.6693 },

    // Australia
    { name: "Sydney", latitude: -33.8688, longitude: 151.2093 },
    { name: "Melbourne", latitude: -37.8136, longitude: 144.9631 },
    { name: "Brisbane", latitude: -27.4705, longitude: 153.0260 },

    // Africa
    { name: "Cairo", latitude: 30.0444, longitude: 31.2357 },
    { name: "Lagos", latitude: 6.5244, longitude: 3.3792 },
    { name: "Johannesburg", latitude: -26.2041, longitude: 28.0473 },
    { name: "Nairobi", latitude: -1.2921, longitude: 36.8219 },
    { name: "Cape Town", latitude: -33.9249, longitude: 18.4241 }
];

interface CitySearchProps {
    onCitySelect: (city: City) => void;
}

export function CitySearch({ onCitySelect }: CitySearchProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredCities = CITIES.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative">
            <div className="relative">
                <RiSearchLine className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground size-[16px] z-10" />
                <Input
                    className="pl-12 pr-12 bg-muted/50 backdrop-blur rounded-3xl"
                    placeholder="Search cities"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                />
                {searchQuery && (
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-[54px] z-10 top-1/2 -translate-y-1/2 h-8 w-8 [&_svg]:size-6"
                        onClick={() => {
                            setSearchQuery("");
                            setShowSuggestions(false);
                        }}
                    >
                        <RiCloseLine />
                    </Button>
                )}
            </div>

            {showSuggestions && searchQuery && (
                <div className="absolute w-full mt-1 bg-background/50 backdrop-blur rounded-3xl py-1 px-2 border shadow-lg z-50">
                    {filteredCities.length > 0 ? (
                        <ul className="py-2">
                            {filteredCities.map((city) => (
                                <li
                                    key={city.name}
                                    className="px-4 py-2 hover:bg-muted cursor-pointer"
                                    onClick={() => {
                                        onCitySelect(city);
                                        setSearchQuery(city.name);
                                        setShowSuggestions(false);
                                    }}
                                >
                                    {city.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-2 text-muted-foreground">
                            No cities found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 