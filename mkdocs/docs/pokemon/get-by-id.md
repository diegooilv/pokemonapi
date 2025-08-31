# Obter Pokémon por ID

**Endpoint:** `GET /pokemon/:id`

**Descrição:** Retorna os dados completos de um Pokémon específico pelo seu ID.

**Parâmetros:**

| Parâmetro | Tipo    | Obrigatório | Descrição     |
| --------- | ------- | ----------- | ------------- |
| id        | inteiro | sim         | ID do Pokémon |

**Exemplo de Request:**

```http
GET /pokemon/20
```

Exemplo de Response:

```json
{
  "id": 20,
  "name": {
    "english": "Raticate",
    "japanese": "ラッタ",
    "chinese": "拉达",
    "french": "Rattatac"
  },
  "type": ["Normal"],
  "base": {
    "HP": 55,
    "Attack": 81,
    "Defense": 60,
    "Sp. Attack": 50,
    "Sp. Defense": 70,
    "Speed": 97
  },
  "species": "Mouse Pokémon",
  "description": "Its whiskers are essential for maintaining its balance. No matter how friendly you are, it will get angry and bite you if you touch its whiskers.",
  "evolution": {
    "prev": ["19", "Level 20"]
  },
  "profile": {
    "height": "0.7 m",
    "weight": "18.5 kg",
    "egg": ["Field"],
    "ability": [
      ["Run Away", "false"],
      ["Guts", "false"],
      ["Hustle", "true"]
    ],
    "gender": "50:50"
  },
  "image": {
    "sprite": "https://pokemon.diegooilv.xyz/images/pokedex/sprites/020.png",
    "thumbnail": "https://pokemon.diegooilv.xyz/images/pokedex/thumbnails/020.png",
    "hires": "https://pokemon.diegooilv.xyz/images/pokedex/hires/020.png"
  }
}
```
