import { Router } from "express";
import {getClients, createClient, updateClient, getClientsById } from '../controllers/clientsController.js'

const router = Router();

router.get("/customers", getClients);
router.post("/customers", createClient);
router.get("/customers/:id",getClientsById);
router.put("/customers/:id", updateClient);

export default router;