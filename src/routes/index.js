import { Router } from "express";
import { cspMiddleware } from "../middlewares/contentSecurityPolicy.js";
import imagesRouter from "./images.router.js";
import pokemonRouter from "./pokemon.router.js";
import itemRouter from "./item.router.js";
import moveRouter from "./move.router.js";
import docsRouter from "./docs.router.js";
import pokedexRouter from "./pokedex.router.js";
import typeRouter from "./type.router.js";

const router = Router();

router.use("/images", imagesRouter);
router.use("/pokemon", pokemonRouter);
router.use("/item", itemRouter);
router.use("/move", moveRouter);
router.use("/docs", cspMiddleware, docsRouter);
router.use("/dex", cspMiddleware, pokedexRouter);
router.use("/type", typeRouter);

router.get("/", (req, res) => {
  res.redirect("/dex");
});

export default router;
