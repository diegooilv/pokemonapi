import { Router } from "express";
import { validateParams } from "../middlewares/validateParams.js";
import {
  handleGetAllItems,
  handleGetItemById,
  handleGetItemByName,
} from "../controllers/itemsController.js";

const router = Router();

router.get("/", handleGetAllItems);
router.get("/name/:name", validateParams(["name"]), handleGetItemByName);
router.get("/id/:id", validateParams(["id"]), handleGetItemById);

export default router;