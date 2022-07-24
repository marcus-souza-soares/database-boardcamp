import { Router } from "express";
import { getRentals, postRentals, endedRental } from '../controllers/rentalsController.js'

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", postRentals)
router.post("/rentals/:id/return", endedRental)

export default router;