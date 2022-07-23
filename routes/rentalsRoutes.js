import { Router } from "express";
import { getRentals } from '../controllers/rentalsController.js'

const router = Router();

router.get("/rentals", getRentals);

export default router;