import {
  getAllPokemons as fetchAllPokemons,
  getPokemonById as fetchPokemonById,
  getPokemonByName as fetchPokemonByName,
} from "../services/pokemonService.js";

export const handleGetPokemonByName = (req, res) => {
  const { name } = req;
  const pokemon = fetchPokemonByName(name);

  if (!pokemon) {
    return res.status(404).json({ error: "Pokémon não encontrado" });
  }

  res.status(200).json(pokemon);
};

export const handleGetPokemonById = (req, res) => {
  const { id } = req;
  const pokemon = fetchPokemonById(id);

  if (!pokemon) {
    return res.status(404).json({ error: "Pokémon não encontrado" });
  }

  res.status(200).json(pokemon);
};

export const handleGetAllPokemons = (req, res) => {
  const { page = 1 } = req.query;
  const limit = 20;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + Number(limit);

  const allPokemons = fetchAllPokemons();

  const paginatedPokemons = allPokemons.slice(startIndex, endIndex);

  res.status(200).json(paginatedPokemons);
};
