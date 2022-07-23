import joi from 'joi';
import connection from '../db/db.js';
import gameSchema from '../schemas/gameSchema.js'

export async function getGames(req, res) {
    const { name } = req.query;
    console.log(name)
    try {
        if (name) {
            const query = `SELECT * FROM games WHERE name LIKE '${name}%'`
            const { rows: gamesBYStr } = await connection.query(
                query);
            console.log(gamesBYStr)
            return res.send(gamesBYStr);
        }

        const { rows: games } = await connection.query(
            "SELECT * FROM games;"
        );
        return res.send(games);


    } catch (error) {
        res.status(404).send(error);
    }
}

export async function postGames(req, res) {
    const gameData = req.body;
    console.log(req.body);
    try {
        // validar de a categoria existe
        const { rows: categoriesIdsServer } = await connection.query("SELECT (id) FROM categories WHERE id = $1", [gameData.categoryId]);
        if (categoriesIdsServer.length < 1) {
            return res.sendStatus(409)
        }
        

        const { error } = gameSchema.validate(gameData);

        if (error) {
            return res.sendStatus(400);
        }
        const { name, image, stockTotal, categoryId, pricePerDay } = gameData;
        const { rows: verifyIfExists } = await connection.query(
            "SELECT * FROM games WHERE name = $1;",
            [gameData.name]
        );
        if (verifyIfExists.length > 0) {
            return res.sendStatus(409);
        }
        console.log(verifyIfExists);

        await connection.query(
            `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
            VALUES ('${name}', '${image}', ${Number(stockTotal)}, ${Number(categoryId)}, '${Number(pricePerDay)}');`
        );
        res.sendStatus(201);
    } catch (error) {
        res.status(404).send(error);
    }
}
