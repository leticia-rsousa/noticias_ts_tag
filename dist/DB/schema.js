"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noticia = exports.cidade = exports.uf = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.uf = (0, sqlite_core_1.sqliteTable)('uf', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    nome: (0, sqlite_core_1.text)('nome').notNull(),
    sigla: (0, sqlite_core_1.text)('sigla').notNull(),
});
exports.cidade = (0, sqlite_core_1.sqliteTable)('cidade', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    nome: (0, sqlite_core_1.text)('nome').notNull(),
    uf_id: (0, sqlite_core_1.integer)('uf_id').references(() => exports.uf.id).notNull(),
});
exports.noticia = (0, sqlite_core_1.sqliteTable)('noticia', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    titulo: (0, sqlite_core_1.text)('titulo').notNull(),
    texto: (0, sqlite_core_1.text)('texto').notNull(),
    cidade_id: (0, sqlite_core_1.integer)('cidade_id').references(() => exports.cidade.id).notNull(),
    data_criacao: (0, sqlite_core_1.text)('data_criacao').default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
