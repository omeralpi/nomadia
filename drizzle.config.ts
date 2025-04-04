import "dotenv/config"

import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./lib/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  out: "drizzle",
  migrations: {
    table: "migrations",
    schema: "public",
  },
})
