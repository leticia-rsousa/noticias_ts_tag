import { db } from './DB/config';
import { noticia, uf, cidade, tag, noticia_tag } from './DB/schema';
import { desc, asc, eq } from 'drizzle-orm';
import * as readline from 'readline-sync';
 
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
    console.log("7 - Cadastrar tag");
    console.log("8 - Vincular tag a notícia");
    console.log("9 - Notícias por tag");
    console.log("10 - Sair");
 
    const opcao = readline.question("Escolha uma opcao: ");
 
    switch (opcao) {
      case '0':
        try {
          const titulo = readline.question("Titulo: ");
          const texto = readline.question("Texto: ");
          const cidades = await db.select().from(cidade);
          if (cidades.length === 0) {
            console.log("Erro: Cadastre uma cidade primeiro!");
            break;
          }
          cidades.forEach(c => console.log(`[${c.id}] ${c.nome}`));
          const cidade_id = readline.questionInt("Selecione o ID da cidade: ");
          const result = await db.insert(noticia).values({ titulo, texto, cidade_id }).returning({ id: noticia.id });
          console.log("Sucesso: Notícia cadastrada!");
 
          // Perguntar se deseja vincular tags
          const tagsDisp = await db.select().from(tag);
          if (tagsDisp.length > 0) {
            const vincularTags = readline.question("Deseja vincular tags? (s/n): ");
            if (vincularTags.toLowerCase() === 's') {
              tagsDisp.forEach(t => console.log(`[${t.id}] ${t.nome}`));
              const tagIds = readline.question("IDs das tags (separados por vírgula): ");
              const ids = tagIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
              const noticiaId = result[0].id;
              for (const tag_id of ids) {
                await db.insert(noticia_tag).values({ noticia_id: noticiaId, tag_id });
              }
              console.log("Tags vinculadas com sucesso!");
            }
          }
        } catch (e) { console.log("Erro ao cadastrar notícia."); }
        break;
 
      case '1':
      case '2':
        try {
          const ordem = opcao === '1' ? desc(noticia.data_criacao) : asc(noticia.data_criacao);
          const lista = await db.select().from(noticia).orderBy(ordem);
          if (lista.length === 0) { console.log("Nenhuma notícia encontrada."); break; }
          lista.forEach(n => console.log(`[${n.data_criacao}] ${n.titulo}`));
          readline.question("(z) Voltar");
        } catch (e) { console.log("Erro ao buscar notícias."); }
        break;
 
      case '3':
        try {
          const ufs = await db.select().from(uf);
          if (ufs.length === 0) { console.log("Erro: Cadastre uma UF primeiro!"); break; }
          ufs.forEach(u => console.log(`[${u.id}] ${u.sigla}`));
          const ufEsc = readline.questionInt("ID do Estado: ");
          console.log("(a) Recentes | (b) Antigas");
          const tipoOrd = readline.question("Ordem: ");
 
          const noticiasUf = await db.select({
            id: noticia.id,
            titulo: noticia.titulo,
            texto: noticia.texto,
            data_criacao: noticia.data_criacao
          }).from(noticia)
            .innerJoin(cidade, eq(noticia.cidade_id, cidade.id))
            .where(eq(cidade.uf_id, ufEsc))
            .orderBy(tipoOrd === 'a' ? desc(noticia.data_criacao) : asc(noticia.data_criacao));
 
          if (noticiasUf.length === 0) { console.log("Nenhuma notícia para este estado."); break; }
          noticiasUf.forEach((n, i) => console.log(`${i + 1}. ${n.titulo}`));
 
          if (readline.question("(d) Detalhar | (z) Voltar: ") === 'd') {
            const idx = readline.questionInt("Numero da noticia: ") - 1;
            if (noticiasUf[idx]) console.log(`\nTitulo: ${noticiasUf[idx].titulo}\nTexto: ${noticiasUf[idx].texto}`);
          }
        } catch (e) { console.log("Erro ao filtrar por estado."); }
        break;
 
      case '4':
        try {
          const agrupadas = await db.select({
            titulo: noticia.titulo,
            cidadeNome: cidade.nome,
            ufSigla: uf.sigla
          }).from(noticia)
            .innerJoin(cidade, eq(noticia.cidade_id, cidade.id))
            .innerJoin(uf, eq(cidade.uf_id, uf.id))
            .orderBy(uf.sigla);
          if (agrupadas.length === 0) { console.log("Nenhuma notícia encontrada."); break; }
          let currentUf = '';
          agrupadas.forEach((n, i) => {
            if (n.ufSigla !== currentUf) {
              console.log(`\n# ${n.ufSigla}`);
              currentUf = n.ufSigla;
            }
            console.log(`${i + 1}. ${n.titulo} (${n.cidadeNome})`);
          });
          readline.question("(z) Voltar");
        } catch (e) { console.log("Erro ao agrupar notícias."); }
        break;
 
      case '5':
        try {
          const nUf = readline.question("Nome UF: ");
          const sUf = readline.question("Sigla: ");
          await db.insert(uf).values({ nome: nUf, sigla: sUf });
          console.log("Sucesso: UF cadastrada!");
        } catch (e) { console.log("Erro ao cadastrar UF."); }
        break;
 
      case '6':
        try {
          const nCid = readline.question("Nome Cidade: ");
          const ufsDisp = await db.select().from(uf);
          if (ufsDisp.length === 0) { console.log("Erro: Cadastre uma UF primeiro!"); break; }
          ufsDisp.forEach(u => console.log(`[${u.id}] ${u.nome}`));
          const idUfCid = readline.questionInt("ID da UF: ");
          await db.insert(cidade).values({ nome: nCid, uf_id: idUfCid });
          console.log("Sucesso: Cidade cadastrada!");
        } catch (e) { console.log("Erro ao cadastrar cidade."); }
        break;
 
      case '7':
        try {
          const nomeTag = readline.question("Nome da tag: ");
          await db.insert(tag).values({ nome: nomeTag });
          console.log("Sucesso: Tag cadastrada!");
        } catch (e) { console.log("Erro ao cadastrar tag."); }
        break;
 
      case '8':
        try {
          const noticias = await db.select().from(noticia);
          if (noticias.length === 0) { console.log("Erro: Nenhuma notícia cadastrada!"); break; }
          noticias.forEach(n => console.log(`[${n.id}] ${n.titulo}`));
          const noticiaId = readline.questionInt("ID da notícia: ");
 
          const tags = await db.select().from(tag);
          if (tags.length === 0) { console.log("Erro: Nenhuma tag cadastrada!"); break; }
          tags.forEach(t => console.log(`[${t.id}] ${t.nome}`));
          const tagId = readline.questionInt("ID da tag: ");
 
          await db.insert(noticia_tag).values({ noticia_id: noticiaId, tag_id: tagId });
          console.log("Sucesso: Tag vinculada à notícia!");
        } catch (e) { console.log("Erro ao vincular tag."); }
        break;
 
      case '9':
        try {
          const tags = await db.select().from(tag);
          if (tags.length === 0) { console.log("Erro: Nenhuma tag cadastrada!"); break; }
          tags.forEach(t => console.log(`[${t.id}] ${t.nome}`));
          const tagId = readline.questionInt("ID da tag: ");
 
          const noticiasTag = await db.select({
            id: noticia.id,
            titulo: noticia.titulo,
            data_criacao: noticia.data_criacao
          }).from(noticia)
            .innerJoin(noticia_tag, eq(noticia.id, noticia_tag.noticia_id))
            .where(eq(noticia_tag.tag_id, tagId))
            .orderBy(desc(noticia.data_criacao));
 
          if (noticiasTag.length === 0) { console.log("Nenhuma notícia encontrada para esta tag."); break; }
          noticiasTag.forEach((n, i) => console.log(`${i + 1}. [${n.data_criacao}] ${n.titulo}`));
          readline.question("(z) Voltar");
        } catch (e) { console.log("Erro ao buscar notícias por tag."); }
        break;
 
      case '10':
        process.exit();
    }
  }
}
 
main();