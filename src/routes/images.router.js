import { Router } from "express";
import express from 'express';
import path from 'path';

const router = Router();

router.use('/', express.static(path.resolve('./images')));

export default router;
