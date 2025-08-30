import { Router } from "express";
import imagesRouter from "./images.router.js";
import pokemonRouter from "./pokemon.router.js";

const router = Router();

router.use("/images", imagesRouter);
router.use("/pokemon", pokemonRouter);

export default router;
