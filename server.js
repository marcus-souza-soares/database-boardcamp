import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categoriesRoutes from './routes/categoriesRoutes.js'
import gamesRoutes from "./routes/gamesRoutes.js"
import clientsRoutes from "./routes/clientsRoutes.js"

dotenv.config();

const server = express();

server.use(express.json());
server.use(cors());

server.use(categoriesRoutes);
server.use(gamesRoutes);
server.use(clientsRoutes);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Servidor conectado em ${PORT}`))