import joi from 'joi';
import connection from '../db/db.js';

export async function getGames(req, res) {
    try {
        const { rows: games } = await connection.query(
            "SELECT * FROM games;"
        );
        res.send(games);
    } catch (error) {
        res.status(404).send(error);
    }
}

export async function postGames(req, res) {
    const gameData = req.body;
    console.log(req.body);

    const schemaGames = joi.object(
        {
            name: joi.string().required(),
            image: joi.string().required(),
            stockTotal: joi.number().required(),
            categoryId: joi.number().required(),
            pricePerDay: joi.number().required(),
        }
    );

    const { error } = schemaGames.validate(gameData);

    if (error) {
        return res.sendStatus(400);
    }
    const { name, image, stockTotal, categoryId, pricePerDay } = gameData;
    try {
        const { rows: verifyIfExists } = await connection.query(
            "SELECT * FROM games WHERE name = $1;",
            [dados.name]
        );
        if (verifyIfExists.length > 0) {
            return res.sendStatus(409);
        }
        console.log(verifyIfExists);

        await connection.query(
            `INSERT INTO games (name, image, stockTotal, categoryId, pricePerDay) 
            VALUES ('${name}, ${image}, ${stockTotal}, ${categoryId}, ${pricePerDay}');`
        );
        res.sendStatus(201);
    } catch (error) {
        res.status(404).send(error);
    }
}
