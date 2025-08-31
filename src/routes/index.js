import { Router } from "express";
import imagesRouter from "./images.router.js";
import pokemonRouter from "./pokemon.router.js";
import itemRouter from "./item.router.js";
import moveRouter from "./move.router.js";
import docsRouter from "./docs.router.js"

const router = Router();

router.use("/images", imagesRouter);
router.use("/pokemon", pokemonRouter);
router.use("/item", itemRouter);
router.use("/move", moveRouter);
router.use("/docs", docsRouter)

export default router;
