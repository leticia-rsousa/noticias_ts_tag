import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
 
export const uf = sqliteTable('uf', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  sigla: text('sigla').notNull(),
});
 
export const cidade = sqliteTable('cidade', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  uf_id: integer('uf_id').references(() => uf.id).notNull(),
});
 
export const noticia = sqliteTable('noticia', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titulo: text('titulo').notNull(),
  texto: text('texto').notNull(),
  cidade_id: integer('cidade_id').references(() => cidade.id).notNull(),
  data_criacao: text('data_criacao').default(sql`CURRENT_TIMESTAMP`),
});
 
export const tag = sqliteTable('tag', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
});
 
export const noticia_tag = sqliteTable('noticia_tag', {
  noticia_id: integer('noticia_id').references(() => noticia.id).notNull(),
  tag_id: integer('tag_id').references(() => tag.id).notNull(),
});