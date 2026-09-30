import express from "express";

import {
    generateAI
} from "../controllers/aiController.js";

import authenticate
    from "../middleware/authMiddleware.js";


const router =
    express.Router();

router.use(authenticate);

router.post(
    "/generate",
    generateAI
);


export default router;