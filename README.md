# Nomadia

A peer-to-peer currency exchange Mini App built with MiniKit and World ID integration.

![Group 4](https://github.com/user-attachments/assets/884ff56c-30e0-45c8-a835-ec3488668099)

## About

Nomadia is a decentralized platform that enables users to exchange currency with others in their vicinity. The application facilitates secure peer-to-peer transactions through World ID verification and features an intuitive interface for managing listings and communications.

## ⚙️ Tech Stack

- 🌍 MiniKit (Mini App Development Kit)
- 🌍 World SDK (World App Integration)
- 🔹 Next.js ⚡ (Frontend framework)
- 🔹 PostgreSQL 🗄️ (Database)
- 🔹 Drizzle ORM 🎯 (TypeScript ORM)
- 🔹 Cloudinary ☁️ (Image storage)
- 🔹 TailwindCSS 🎨 (Styling)
- 🔹 Shadcn/UI 🎯 (UI Components)
- 🔹 tRPC 🎯 (API layer)

## Setup

```bash
# Copy .env.example to .env and set the environment variables
cp .env.example .env

# Database setup
docker compose up -d

# Install dependencies
pnpm install

# Migrate database
pnpm db:push

# Start the development server
pnpm dev
```

To run as a mini app:
1. Choose a production app in the dev portal
2. Use NGROK to tunnel
3. Set the `NEXTAUTH_URL` and the redirect URL for World ID sign-in to your ngrok URL

View docs: [Docs](https://docs.world.org/)

[Developer Portal](https://developer.worldcoin.org/)

## Key Features

1. **P2P Exchange**
   - Browse active currency exchange listings
   - Interactive map view for local transactions
   - Slider navigation for easy browsing
   - QR code functionality for transactions

2. **My Listings**
   - Manage your personal exchange listings
   - Track active and completed transactions

3. **Create Listing**
   - Post new currency exchange offers
   - Set exchange rates and preferences

4. **Chat System**
   - Direct messaging with potential exchange partners
   - Conversation history tracking
   - Real-time communication

5. **Profile Management**
   - Customize user profile
   - Update avatar and personal information
   - Manage account settings
