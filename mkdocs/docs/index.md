# Bem-vindo à API Pokedex

Esta é a documentação da **API Pokedex**, que permite acessar informações sobre Pokémon, itens, movimentos e imagens.

Você encontrará aqui todos os **endpoints disponíveis**, exemplos de **request e response** e descrição de cada recurso.

---

## **Rotas disponíveis**

### **/pokemon**

- Gerencia informações de Pokémon.
- Endpoints principais:
  - `GET /pokemon/:id` → Retorna os dados de um Pokémon pelo ID.
  - `GET /pokemon/name/:nome` → Retorna os dados pelo nome.

### **/item**

- Gerencia informações sobre itens.
- Endpoints principais:
  - `GET /item/:id` → Retorna detalhes de um item pelo ID.
  - `GET /item/name/:nome` → Retorna detalhes de um item pelo nome.

### **/move**

- Gerencia informações sobre movimentos (moves).
- Endpoints principais:
  - `GET /move/:id` → Retorna detalhes de um movimento pelo ID.
  - `GET /move/name/:nome` → Retorna detalhes de um movimento pelo nome.

---

> Dica: Clique nas seções da barra lateral para acessar **documentação detalhada** de cada endpoint com exemplos de request e response.
