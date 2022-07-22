import { Router } from "express";
import {getClients, createClient, updateClient } from '../controllers/clientsController.js'

const router = Router();

router.get("/customers", getClients);
router.post("/customers", createClient);
router.patch("/customers", updateClient);

export default router;