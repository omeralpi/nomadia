import "dotenv/config";

import { db } from "@/lib/db";
import { listings, users } from "@/lib/db/schema";

export async function seed() {
    const testUsers = [
        {
            id: "1",
            name: "Zeynep",
            bio: "Digital nomad exploring Asia",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zeynep"
        },
        {
            id: "2",
            name: "Ali",
            bio: "Crypto enthusiast",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ali"
        },
        {
            id: "3",
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
            userId: "1",
            type: "buying",
            amount: "500",
            currency: "TWD",
            description: "Need TWD for travel expenses",
            location: "Taipei 101",
            latitude: "25.033964",
            longitude: "121.564468",
            status: "active",
        },
        {
            userId: "2",
            type: "selling",
            amount: "1000",
            currency: "EUR",
            description: "Selling EUR for USDC",
            location: "Taksim Square",
            latitude: "41.036944",
            longitude: "28.985000",
            status: "active",
        },
        {
            userId: "3",
            type: "buying",
            amount: "300",
            currency: "USD",
            description: "Need USD for shopping",
            location: "Shibuya Crossing",
            latitude: "35.659500",
            longitude: "139.700500",
            status: "active",
        },
        {
            userId: "4",
            type: "selling",
            amount: "2000",
            currency: "TWD",
            description: "Exchange TWD to EUR",
            location: "Xinyi District",
            latitude: "25.027600",
            longitude: "121.563900",
            status: "active",
        },
        {
            userId: "5",
            type: "buying",
            amount: "750",
            currency: "EUR",
            description: "Looking for EUR",
            location: "Galata Tower",
            latitude: "41.025800",
            longitude: "28.974200",
            status: "active",
        },
        {
            userId: "1",
            type: "selling",
            amount: "1500",
            currency: "USDC",
            description: "USDC available for exchange",
            location: "Taipei Main Station",
            latitude: "25.047800",
            longitude: "121.517000",
            status: "active",
        },
        {
            userId: "2",
            type: "buying",
            amount: "800",
            currency: "TWD",
            description: "Need TWD urgently",
            location: "Grand Bazaar",
            latitude: "41.010700",
            longitude: "28.968300",
            status: "active",
        }
    ];

    await db.insert(listings)
        .values(testListings)
        .onConflictDoNothing();
}

seed();