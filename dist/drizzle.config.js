"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: "./db/schema.ts",
    out: "./drizzle",
    dialect: "sqlite", // Mudamos de driver para dialect
    dbCredentials: {
        url: "sqlite.db", // Agora o url fica direto aqui para o sqlite
    },
});
