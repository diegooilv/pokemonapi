# Obter Pokémon por Nome

**Endpoint:** `GET /pokemon/name/:nome`

**Descrição:** Retorna os dados completos de um Pokémon específico pelo nome.

**Parâmetros:**

| Parâmetro | Tipo   | Obrigatório | Descrição       |
| --------- | ------ | ----------- | --------------- |
| nome      | string | sim         | Nome do Pokémon |

**Exemplo de Request:**

```http
GET /pokemon/name/pikachu
```

Exemplo de Response:

```json
{
  "id": 25,
  "name": {
    "english": "Pikachu",
    "japanese": "ピカチュウ",
    "chinese": "皮卡丘",
    "french": "Pikachu"
  },
  "type": ["Electric"],
  "base": {
    "HP": 35,
    "Attack": 55,
    "Defense": 40,
    "Sp. Attack": 50,
    "Sp. Defense": 50,
    "Speed": 90
  },
  "species": "Mouse Pokémon",
  "description": "While sleeping, it generates electricity in the sacs in its cheeks. If it’s not getting enough sleep, it will be able to use only weak electricity.",
  "evolution": {
    "prev": ["172", "high Friendship"],
    "next": [["26", "use Thunder Stone"]]
  },
  "profile": {
    "height": "0.4 m",
    "weight": "6 kg",
    "egg": ["Field", "Fairy"],
    "ability": [
      ["Static", "false"],
      ["Lightning Rod", "true"]
    ],
    "gender": "50:50"
  },
  "image": {
    "sprite": "https://pokemon.diegooilv.xyz/images/pokedex/sprites/025.png",
    "thumbnail": "https://pokemon.diegooilv.xyz/images/pokedex/thumbnails/025.png",
    "hires": "https://pokemon.diegooilv.xyz/images/pokedex/hires/025.png"
  }
}
```
