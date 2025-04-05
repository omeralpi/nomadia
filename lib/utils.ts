import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatAmount(amount: string | number, minimumFractionDigits = 2) {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits,
        maximumFractionDigits: 8,
        useGrouping: true,
    }).format(numericAmount);
}

export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

import { formatDistanceToNow } from "date-fns";

export function convertToLocalTime(utcDate: Date) {
    const date = new Date(utcDate);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);

    return formatDistanceToNow(localDate, { addSuffix: true });
}
