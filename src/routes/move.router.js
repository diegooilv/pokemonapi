import { Router } from "express";
import { validateParams } from "../middlewares/validateParams.js";
import {
  handleGetMoveById,
  handleGetMoveByName,
} from "../controllers/moveController.js";

const router = Router();

router.get("/", (req, res) => {
  res.status(400).json({ error: "Use /id ou /name !" });
});

router.get("/id/:id", validateParams(["id"]), handleGetMoveById);
router.get("/name/:name", validateParams(["name"]), handleGetMoveByName);

export default router;
