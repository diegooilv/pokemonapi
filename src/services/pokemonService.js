import fs from "fs";
import path from "path";

const filePath = path.resolve("./json/pokedex.json");

export const getAllPokemons = () => {
  const jsonData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(jsonData);
};

export const getPokemonById = (id) => {
  const pokemons = getAllPokemons();
  const numericId = Number(id);
  return pokemons.find((p) => p.id === numericId);
};

export const getPokemonByName = (name) => {
  const pokemons = getAllPokemons();
  const lowerName = name.toLowerCase();

  return pokemons.find((p) => {
    return Object.values(p.name).some((n) => n.toLowerCase() === lowerName);
  });
};
