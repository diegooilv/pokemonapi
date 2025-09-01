import { Router } from "express";
import express from "express";
import path from "path";

const router = Router();

router.use("/", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});
router.use("/", express.static(path.resolve("./images")));

export default router;
