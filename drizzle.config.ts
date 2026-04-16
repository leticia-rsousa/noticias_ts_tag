import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite", // Mudamos de driver para dialect
  dbCredentials: {
    url: "sqlite.db", // Agora o url fica direto aqui para o sqlite
  },
});