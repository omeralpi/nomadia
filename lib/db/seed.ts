import "dotenv/config";

import { db } from "@/lib/db";
import { currencies, listings, users } from "@/lib/db/schema";
import { reset } from "drizzle-seed";
import * as schema from "./schema";

export async function seed() {
    await reset(db, schema)

    const testCurrencies = [
        {
            code: "USD",
            name: "US Dollar",
            type: "fiat" as const,
            iconUrl: "https://hatscripts.github.io/circle-flags/flags/us.svg"
        },
        {
            code: "TWD",
            name: "New Taiwan Dollar",
            type: "fiat" as const,
            iconUrl: "https://hatscripts.github.io/circle-flags/flags/ad.svg"
        },
        {
            code: "EUR",
            name: "Euro",
            type: "fiat" as const,
            iconUrl: "https://hatscripts.github.io/circle-flags/flags/european_union.svg"
        },
        {
            code: "USDCE",
            name: "USDC",
            type: "crypto" as const,
            iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Circle_USDC_Logo.svg/1024px-Circle_USDC_Logo.svg.png?20220815163658"
        },
        {
            code: "WLD",
            name: "Worldcoin",
            type: "crypto" as const,
            iconUrl: "https://cryptologos.cc/logos/worldcoin-org-wld-logo.svg?v=040"
        }
    ];

    await db.insert(currencies)
        .values(testCurrencies)
        .onConflictDoNothing();

    const testUsers = [
        {
            id: "C88W1ZXzRYerdUnhXAID7",
            address: "0xa88d282916F1E9b8735639eae2eFf758989Efbc6",
            name: "Omer",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zeynep"
        },
        {
            id: "0x0e1a172038935d0780d2105ab952cd24bb2174a4f6da600713e8f88c529fb166",
            name: "Mahmut",
            bio: "Digital nomad exploring Asia",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zeynep"
        },
        {
            id: "0x21fec9682c2bc686f0ff5803fd8ee14e7dbb9889eb1003e12a74caca5d7cea60",
            name: "Ali",
            bio: "Crypto enthusiast",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ali"
        },
        {
            id: "0x085e21a3cbbe3452e982dfab0f3590d4d208592875e5ebeec2778abd3018255d",
            name: "Maria",
            bio: "Travel blogger",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria"
        },
        {
            id: "4",
            name: "Chen",
            bio: "Tech entrepreneur",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chen"
        },
        {
            id: "5",
            name: "Yuki",
            bio: "Digital artist",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki"
        }
    ];

    for (const user of testUsers) {
        await db.insert(users)
            .values(user)
            .onConflictDoNothing();
    }

    const testListings = [
        {
            userId: "0x0e1a172038935d0780d2105ab952cd24bb2174a4f6da600713e8f88c529fb166",
            type: "buying" as const,
            amount: "500",
            currencyCode: "TWD",
            description: "Need TWD for travel expenses",
            location: "Taipei 101",
            latitude: "25.033964",
            longitude: "121.564468",
            status: "active" as const,
        },
        {
            userId: "0x21fec9682c2bc686f0ff5803fd8ee14e7dbb9889eb1003e12a74caca5d7cea60",
            type: "selling" as const,
            amount: "1000",
            currencyCode: "EUR",
            description: "Selling EUR for USDC",
            location: "Taksim Square",
            latitude: "41.036944",
            longitude: "28.985000",
            status: "active" as const,
        },
        {
            userId: "0x085e21a3cbbe3452e982dfab0f3590d4d208592875e5ebeec2778abd3018255d",
            type: "buying" as const,
            amount: "300",
            currencyCode: "USD",
            description: "Need USD for shopping",
            location: "Shibuya Crossing",
            latitude: "35.659500",
            longitude: "139.700500",
            status: "active" as const,
        },
        {
            userId: "4",
            type: "selling" as const,
            amount: "2000",
            currencyCode: "TWD",
            description: "Exchange TWD to EUR",
            location: "Xinyi District",
            latitude: "25.027600",
            longitude: "121.563900",
            status: "active" as const,
        },
        {
            userId: "5",
            type: "buying" as const,
            amount: "750",
            currencyCode: "EUR",
            description: "Looking for EUR",
            location: "Galata Tower",
            latitude: "41.025800",
            longitude: "28.974200",
            status: "active" as const,
        },
        {
            userId: "0x0e1a172038935d0780d2105ab952cd24bb2174a4f6da600713e8f88c529fb166",
            type: "selling" as const,
            amount: "1500",
            currencyCode: "USDCE",
            description: "USDC available for exchange",
            location: "Taipei Main Station",
            latitude: "25.047800",
            longitude: "121.517000",
            status: "active" as const,
        },
        {
            userId: "0x21fec9682c2bc686f0ff5803fd8ee14e7dbb9889eb1003e12a74caca5d7cea60",
            type: "buying" as const,
            amount: "800",
            currencyCode: "TWD",
            description: "Need TWD urgently",
            location: "Grand Bazaar",
            latitude: "41.010700",
            longitude: "28.968300",
            status: "active" as const,
        }
    ];

    await db.insert(listings)
        .values(testListings)
        .onConflictDoNothing();
}

seed();