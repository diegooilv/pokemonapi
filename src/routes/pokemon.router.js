import { Router } from "express";
import { validateParams } from "../middlewares/validateParams.js";
import {
  handleGetAllPokemons,
  handleGetPokemonById,
  handleGetPokemonByName,
} from "../controllers/pokemonController.js";

const router = Router();

router.get("/id/:id", validateParams(["id"]), handleGetPokemonById);

router.get("/name/:name", validateParams(["name"]), handleGetPokemonByName);

router.get("/", handleGetAllPokemons);

export default router;
