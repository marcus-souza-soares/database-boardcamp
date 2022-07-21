import { Router } from "express";
import { getGames, postGames } from "../controllers/gamesControllers.js"

const router = Router();

router.get("/games", getGames);
router.post("/games", postGames)

export default router;