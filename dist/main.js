"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./DB/config");
const schema_1 = require("./DB/schema");
const drizzle_orm_1 = require("drizzle-orm");
const readline = __importStar(require("readline-sync"));
async function main() {
    while (true) {
        console.log("\n--- MENU PRINCIPAL ---");
        console.log("0 - Cadastrar notícia");
        console.log("1 - Exibir notícias (Mais recentes)");
        console.log("2 - Exibir notícias (Mais antigas)");
        console.log("3 - Notícias de um estado específico");
        console.log("4 - Notícias agrupadas por estado");
        console.log("5 - Cadastrar UF");
        console.log("6 - Cadastrar cidade");
        console.log("7 - Sair");
        const opcao = readline.question("Escolha uma opcao: ");
        switch (opcao) {
            case '0':
                try {
                    const titulo = readline.question("Titulo: ");
                    const texto = readline.question("Texto: ");
                    const cidades = await config_1.db.select().from(schema_1.cidade);
                    if (cidades.length === 0) {
                        console.log("Erro: Cadastre uma cidade primeiro!");
                        break;
                    }
                    cidades.forEach(c => console.log(`[${c.id}] ${c.nome}`));
                    const cidade_id = readline.questionInt("Selecione o ID da cidade: ");
                    await config_1.db.insert(schema_1.noticia).values({ titulo, texto, cidade_id });
                    console.log("Sucesso: Notícia cadastrada!");
                }
                catch (e) {
                    console.log("Erro ao cadastrar notícia.");
                }
                break;
            case '1':
            case '2':
                try {
                    const ordem = opcao === '1' ? (0, drizzle_orm_1.desc)(schema_1.noticia.data_criacao) :
                        (0, drizzle_orm_1.asc)(schema_1.noticia.data_criacao);
                    const lista = await config_1.db.select().from(schema_1.noticia).orderBy(ordem);
                    if (lista.length === 0) {
                        console.log("Nenhuma notícia encontrada.");
                        break;
                    }
                    lista.forEach(n => console.log(`[${n.data_criacao}] 
${n.titulo}`));
                    readline.question("(z) Voltar");
                }
                catch (e) {
                    console.log("Erro ao buscar notícias.");
                }
                break;
            case '3':
                try {
                    const ufs = await config_1.db.select().from(schema_1.uf);
                    if (ufs.length === 0) {
                        console.log("Erro: Cadastre uma UF primeiro!");
                        break;
                    }
                    ufs.forEach(u => console.log(`[${u.id}] ${u.sigla}`));
                    const ufEsc = readline.questionInt("ID do Estado: ");
                    console.log("(a) Recentes | (b) Antigas");
                    const tipoOrd = readline.question("Ordem: ");
                    const noticiasUf = await config_1.db.select({
                        id: schema_1.noticia.id,
                        titulo: schema_1.noticia.titulo,
                        texto: schema_1.noticia.texto,
                        data_criacao: schema_1.noticia.data_criacao
                    }).from(schema_1.noticia)
                        .innerJoin(schema_1.cidade, (0, drizzle_orm_1.eq)(schema_1.noticia.cidade_id, schema_1.cidade.id))
                        .where((0, drizzle_orm_1.eq)(schema_1.cidade.uf_id, ufEsc))
                        .orderBy(tipoOrd === 'a' ? (0, drizzle_orm_1.desc)(schema_1.noticia.data_criacao) :
                        (0, drizzle_orm_1.asc)(schema_1.noticia.data_criacao));
                    if (noticiasUf.length === 0) {
                        console.log("Nenhuma notícia para este estado.");
                        break;
                    }
                    noticiasUf.forEach((n, i) => console.log(`${i + 1}. 
${n.titulo}`));
                    if (readline.question("(d) Detalhar | (z) Voltar: ") === 'd') {
                        const idx = readline.questionInt("Numero da noticia: ") - 1;
                        if (noticiasUf[idx])
                            console.log(`\nTitulo: 
${noticiasUf[idx].titulo}\nTexto: ${noticiasUf[idx].texto}`);
                    }
                }
                catch (e) {
                    console.log("Erro ao filtrar por estado.");
                }
                break;
            case '4':
                try {
                    const agrupadas = await config_1.db.select({
                        titulo: schema_1.noticia.titulo,
                        cidadeNome: schema_1.cidade.nome,
                        ufSigla: schema_1.uf.sigla
                    }).from(schema_1.noticia)
                        .innerJoin(schema_1.cidade, (0, drizzle_orm_1.eq)(schema_1.noticia.cidade_id, schema_1.cidade.id))
                        .innerJoin(schema_1.uf, (0, drizzle_orm_1.eq)(schema_1.cidade.uf_id, schema_1.uf.id))
                        .orderBy(schema_1.uf.sigla);
                    if (agrupadas.length === 0) {
                        console.log("Nenhuma notícia encontrada.");
                        break;
                    }
                    let currentUf = '';
                    agrupadas.forEach((n, i) => {
                        if (n.ufSigla !== currentUf) {
                            console.log(`\n# ${n.ufSigla}`);
                            currentUf = n.ufSigla;
                        }
                        console.log(`${i + 1}. ${n.titulo} (${n.cidadeNome})`);
                    });
                    readline.question("(z) Voltar");
                }
                catch (e) {
                    console.log("Erro ao agrupar notícias.");
                }
                break;
            case '5':
                try {
                    const nUf = readline.question("Nome UF: ");
                    const sUf = readline.question("Sigla: ");
                    await config_1.db.insert(schema_1.uf).values({ nome: nUf, sigla: sUf });
                    console.log("Sucesso: UF cadastrada!");
                }
                catch (e) {
                    console.log("Erro ao cadastrar UF.");
                }
                break;
            case '6':
                try {
                    const nCid = readline.question("Nome Cidade: ");
                    const ufsDisp = await config_1.db.select().from(schema_1.uf);
                    if (ufsDisp.length === 0) {
                        console.log("Erro: Cadastre uma UF primeiro!");
                        break;
                    }
                    ufsDisp.forEach(u => console.log(`[${u.id}] ${u.nome}`));
                    const idUfCid = readline.questionInt("ID da UF: ");
                    await config_1.db.insert(schema_1.cidade).values({ nome: nCid, uf_id: idUfCid });
                    console.log("Sucesso: Cidade cadastrada!");
                }
                catch (e) {
                    console.log("Erro ao cadastrar cidade.");
                }
                break;
            case '7':
                process.exit();
        }
    }
}
main();
