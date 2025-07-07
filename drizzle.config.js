import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_zTSWrs2wc6KV@ep-steep-salad-a8dtyqal-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"
  }
});