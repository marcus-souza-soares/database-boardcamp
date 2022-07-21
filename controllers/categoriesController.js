import connection from "../db/db.js";
import joi from "joi";

export async function getCategories(req, res) {
    try {
        const { rows: categories } = await connection.query(
            "SELECT * FROM categories;"
        );
        res.send(categories);
    } catch (error) {
        res.status(404).send(error);
    }
}

export async function postCategories(req, res) {
    const dados = req.body;
    console.log(req.body);

    const schemaCategorie = joi.object({
        name: joi.string().required(),
    });

    const { error } = schemaCategorie.validate(dados);

    if (error) {
        return res.sendStatus(400);
    }
    try {
        const { rows: verifyIfExists } = await connection.query(
            "SELECT * FROM categories WHERE name = $1;",
            [dados.name]
        );
        if (verifyIfExists.length > 0) {
            return res.sendStatus(409);
        }
        console.log(verifyIfExists);

        await connection.query(
            `INSERT INTO categories (name) VALUES ('${dados.name}');`
        );
        res.sendStatus(201);
    } catch (error) {
        res.status(404).send(error);
    }
}
