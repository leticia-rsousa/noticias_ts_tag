### Integrantes:
- Letícia Rodrigues de Sousa - UC24100481
- Mateus Vitor Venâncio de Deus - UC24102506

---

# noticias_ts_tag

Este projeto é uma aplicação de linha de comando (CLI) desenvolvida para o gerenciamento de notícias, cidades, unidades federativas (UF) e **tags**. A solução utiliza **TypeScript** com o **Drizzle ORM** para interação com um banco de dados **SQLite**.

## 🛠️ Tecnologias Utilizadas

* **Linguagem:** TypeScript
* **Banco de Dados:** SQLite
* **ORM:** Drizzle ORM
* **Interface:** CLI (Command Line Interface) via `readline-sync`
* **Ambiente de Execução:** Node.js

## 🗄️ Estrutura do Banco de Dados

O banco de dados é composto por cinco tabelas principais, seguindo o modelo relacional definido:

1. **`uf`**: Armazena as unidades federativas (`id`, `nome`, `sigla`).
2. **`cidade`**: Armazena as cidades e sua relação com a UF (`id`, `nome`, `uf_id`).
3. **`noticia`**: Armazena as notícias, vinculadas a uma cidade (`id`, `titulo`, `texto`, `cidade_id`, `data_criacao`).

   *Nota: O campo `data_criacao` é gerado automaticamente pelo banco no momento da inserção via `DEFAULT CURRENT_TIMESTAMP`.*

4. **`tag`**: Armazena as tags cadastradas (`id`, `nome`).
5. **`noticia_tag`**: Tabela intermediária para relacionamento entre notícias e tags (`noticia_id`, `tag_id`).

## 🚀 Funcionalidades

O sistema oferece um menu interativo com as seguintes capacidades:

* **Opção 0 - Cadastrar notícia:** Vincula um título e texto a uma cidade existente, com opção de associar tags no momento do cadastro.
* **Opção 1 & 2 - Listagem Cronológica:** Exibe notícias ordenadas das mais recentes para as mais antigas ou vice-versa.
* **Opção 3 - Filtro por Estado:** Consulta notícias de uma UF específica com escolha de ordenação e opção de detalhamento.
* **Opção 4 - Agrupamento por UF:** Exibe notícias organizadas por estado.
* **Opção 5 & 6 - Configuração de Localidade:** Cadastro de novas UFs e Cidades.
* **Opção 7 - Cadastrar tag:** Permite registrar novas tags no sistema.
* **Opção 8 - Vincular tag a notícia:** Associa manualmente uma tag a uma notícia já cadastrada.
* **Opção 9 - Notícias por tag:** Lista notícias filtradas por uma tag específica.
* **Opção 10 - Sair:** Encerra a aplicação.

## 📦 Instalação e Execução

1. **Instalar dependências:**

```bash
npm install
```

2. **Configurar o banco de dados (Drizzle):**

```bash
npx drizzle-kit push
```

3. **Executar a aplicação:**

```bash
npx tsx main.ts
```

## 📝 Detalhes Técnicos

* **Integridade Referencial:** O sistema valida a existência de UFs antes de permitir o cadastro de cidades, de cidades antes do cadastro de notícias, e de tags/notícias antes dos vínculos.
* **Relacionamento Muitos-para-Muitos:** Implementado entre notícias e tags por meio da tabela `noticia_tag`.
* **Consultas Relacionais:** Utiliza `innerJoin` para consolidar informações entre tabelas e realizar filtros por estado e tag.
