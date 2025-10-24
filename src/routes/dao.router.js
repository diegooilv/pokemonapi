import { Router } from "express";
import express from 'express';
import path from 'path';

const router = Router();

router.use('/', express.static(path.resolve('./dao')));

export default router;