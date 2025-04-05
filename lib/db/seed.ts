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
            name: "USDCe",
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
            address: "0x0e1a172038935d0780d2105ab952cd24bb2174a4f6da600713e8f88c529fb166",
            name: "Mahmut",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zeynep"
        },
        {
            id: "0x21fec9682c2bc686f0ff5803fd8ee14e7dbb9889eb1003e12a74caca5d7cea60",
            address: "0x21fec9682c2bc686f0ff5803fd8ee14e7dbb9889eb1003e12a74caca5d7cea60",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ali"
        },
        {
            id: "0x085e21a3cbbe3452e982dfab0f3590d4d208592875e5ebeec2778abd3018255d",
            address: "0x085e21a3cbbe3452e982dfab0f3590d4d208592875e5ebeec2778abd3018255d",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria"
        },
        {
            id: "4",
            name: "Chen",
            address: "0x4",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chen"
        },
        {
            id: "5",
            name: "Yuki",
            address: "0x5",
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
        },
        {
            userId: "C88W1ZXzRYerdUnhXAID7",
            type: "selling" as const,
            amount: "1200",
            currencyCode: "USD",
            description: "Selling USD in Kadikoy",
            location: "Kadikoy",
            latitude: "40.9907",
            longitude: "29.0289",
            status: "active" as const,
        },
        {
            userId: "4",
            type: "buying" as const,
            amount: "500",
            currencyCode: "EUR",
            description: "Need EUR in Besiktas",
            location: "Besiktas",
            latitude: "41.0422",
            longitude: "29.0047",
            status: "active" as const,
        },
        {
            userId: "5",
            type: "selling" as const,
            amount: "2500",
            currencyCode: "USDCE",
            description: "USDC available in Sisli",
            location: "Sisli",
            latitude: "41.0602",
            longitude: "28.9877",
            status: "active" as const,
        },
        {
            userId: "0x0e1a172038935d0780d2105ab952cd24bb2174a4f6da600713e8f88c529fb166",
            type: "buying" as const,
            amount: "1000",
            currencyCode: "WLD",
            description: "Looking for WLD in Uskudar",
            location: "Uskudar",
            latitude: "41.0235",
            longitude: "29.0165",
            status: "active" as const,
        },
        {
            userId: "0x21fec9682c2bc686f0ff5803fd8ee14e7dbb9889eb1003e12a74caca5d7cea60",
            type: "selling" as const,
            amount: "3000",
            currencyCode: "TWD",
            description: "TWD available in Beyoglu",
            location: "Beyoglu",
            latitude: "41.0361",
            longitude: "28.9784",
            status: "active" as const,
        },
        {
            userId: "4",
            type: "buying" as const,
            amount: "800",
            currencyCode: "USD",
            description: "Need USD in Fatih",
            location: "Fatih",
            latitude: "41.0186",
            longitude: "28.9397",
            status: "active" as const,
        },
        {
            userId: "5",
            type: "selling" as const,
            amount: "1500",
            currencyCode: "EUR",
            description: "EUR available in Bakirkoy",
            location: "Bakirkoy",
            latitude: "40.9819",
            longitude: "28.8772",
            status: "active" as const,
        },
        {
            userId: "C88W1ZXzRYerdUnhXAID7",
            type: "buying" as const,
            amount: "2000",
            currencyCode: "USDCE",
            description: "Looking for USDC in Maltepe",
            location: "Maltepe",
            latitude: "40.9357",
            longitude: "29.1516",
            status: "active" as const,
        },
        {
            userId: "0x0e1a172038935d0780d2105ab952cd24bb2174a4f6da600713e8f88c529fb166",
            type: "selling" as const,
            amount: "900",
            currencyCode: "WLD",
            description: "WLD for sale in Levent",
            location: "Levent",
            latitude: "41.0825",
            longitude: "29.0178",
            status: "active" as const,
        },
        {
            userId: "0x21fec9682c2bc686f0ff5803fd8ee14e7dbb9889eb1003e12a74caca5d7cea60",
            type: "buying" as const,
            amount: "1700",
            currencyCode: "TWD",
            description: "Need TWD in Mecidiyekoy",
            location: "Mecidiyekoy",
            latitude: "41.0679",
            longitude: "28.9952",
            status: "active" as const,
        },
        {
            userId: "4",
            type: "selling" as const,
            amount: "2200",
            currencyCode: "USD",
            description: "USD available in Bebek",
            location: "Bebek",
            latitude: "41.0773",
            longitude: "29.0432",
            status: "active" as const,
        },
        {
            userId: "5",
            type: "buying" as const,
            amount: "1300",
            currencyCode: "EUR",
            description: "Looking for EUR in Nisantasi",
            location: "Nisantasi",
            latitude: "41.0522",
            longitude: "28.9872",
            status: "active" as const,
        },
        {
            userId: "C88W1ZXzRYerdUnhXAID7",
            type: "selling" as const,
            amount: "2800",
            currencyCode: "USDCE",
            description: "USDC for sale in Etiler",
            location: "Etiler",
            latitude: "41.0819",
            longitude: "29.0346",
            status: "active" as const,
        },
        {
            userId: "0x0e1a172038935d0780d2105ab952cd24bb2174a4f6da600713e8f88c529fb166",
            type: "buying" as const,
            amount: "1600",
            currencyCode: "WLD",
            description: "Need WLD in Ortakoy",
            location: "Ortakoy",
            latitude: "41.0474",
            longitude: "29.0277",
            status: "active" as const,
        },
        {
            userId: "0x21fec9682c2bc686f0ff5803fd8ee14e7dbb9889eb1003e12a74caca5d7cea60",
            type: "selling" as const,
            amount: "1900",
            currencyCode: "TWD",
            description: "TWD available in Sariyer",
            location: "Sariyer",
            latitude: "41.1671",
            longitude: "29.0571",
            status: "active" as const,
        },
        {
            userId: "4",
            type: "buying" as const,
            amount: "2400",
            currencyCode: "USD",
            description: "Need USD in Zeytinburnu",
            location: "Zeytinburnu",
            latitude: "41.0191",
            longitude: "28.9092",
            status: "active" as const,
        },
        {
            userId: "5",
            type: "selling" as const,
            amount: "1100",
            currencyCode: "EUR",
            description: "EUR for sale in Eyup",
            location: "Eyup",
            latitude: "41.0478",
            longitude: "28.9337",
            status: "active" as const,
        },
        {
            userId: "C88W1ZXzRYerdUnhXAID7",
            type: "buying" as const,
            amount: "3200",
            currencyCode: "USDCE",
            description: "Looking for USDC in Atasehir",
            location: "Atasehir",
            latitude: "40.9923",
            longitude: "29.1244",
            status: "active" as const,
        },
        {
            userId: "0x0e1a172038935d0780d2105ab952cd24bb2174a4f6da600713e8f88c529fb166",
            type: "selling" as const,
            amount: "2700",
            currencyCode: "WLD",
            description: "WLD available in Umraniye",
            location: "Umraniye",
            latitude: "41.0167",
            longitude: "29.1167",
            status: "active" as const,
        },
        {
            userId: "0x21fec9682c2bc686f0ff5803fd8ee14e7dbb9889eb1003e12a74caca5d7cea60",
            type: "buying" as const,
            amount: "1400",
            currencyCode: "TWD",
            description: "Need TWD in Kadikoy Moda",
            location: "Moda",
            latitude: "40.9847",
            longitude: "29.0264",
            status: "active" as const,
        },
        {
            userId: "4",
            type: "selling" as const,
            amount: "2100",
            currencyCode: "USD",
            description: "USD for sale in Bagdat Street",
            location: "Bagdat Street",
            latitude: "40.9619",
            longitude: "29.0719",
            status: "active" as const,
        },
        {
            userId: "5",
            type: "buying" as const,
            amount: "1800",
            currencyCode: "EUR",
            description: "Looking for EUR in Sultanahmet",
            location: "Sultanahmet",
            latitude: "41.0054",
            longitude: "28.9768",
            status: "active" as const,
        },
        {
            userId: "C88W1ZXzRYerdUnhXAID7",
            type: "selling" as const,
            amount: "2900",
            currencyCode: "USDCE",
            description: "USDC available in Karakoy",
            location: "Karakoy",
            latitude: "41.0225",
            longitude: "28.9742",
            status: "active" as const,
        },
        {
            userId: "0x0e1a172038935d0780d2105ab952cd24bb2174a4f6da600713e8f88c529fb166",
            type: "buying" as const,
            amount: "2300",
            currencyCode: "WLD",
            description: "Need WLD in Balat",
            location: "Balat",
            latitude: "41.0297",
            longitude: "28.9490",
            status: "active" as const,
        }
    ];

    await db.insert(listings)
        .values(testListings)
        .onConflictDoNothing();
}

seed();