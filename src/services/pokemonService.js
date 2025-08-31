import fs from "fs";
import path from "path";

const filePath = path.resolve("./json/pokedex.json");

// lê o arquivo **uma vez** ao iniciar
const pokemons = JSON.parse(fs.readFileSync(filePath, "utf-8"));

export const getAllPokemons = () => pokemons;

export const getPokemonById = (id) => {
  const numericId = Number(id);
  return pokemons.find((p) => p.id === numericId);
};

export const getPokemonByName = (name) => {
  if (!name) return null;
  const lowerName = name.toLowerCase().trim();

  return (
    pokemons.find((p) => {
      if (!p.name) return false;

      return Object.values(p.name)
        .filter((n) => typeof n === "string")
        .some((n) => n.toLowerCase() === lowerName);
    }) || null
  );
};
