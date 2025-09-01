import { Router } from "express";
import { validateParams } from "../middlewares/validateParams.js";
import { handleGetTypeByName } from "../controllers/typeController.js";
const router = Router();

router.get("/:name", validateParams(["name"]), handleGetTypeByName);

export default router;