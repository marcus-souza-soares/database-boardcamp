import connection from "../db/db.js";
import rentalSchema from "../schemas/rentalsSchema.js"
import dayjs from 'dayjs';

export async function getRentals(req, res) {
    const { customerId } = req.query;
    const { gameId } = req.query;
    let condition = '';
    let condition1 = '';
    let condition2 = '';
    const list = [];
    if (customerId) {
        list.push(customerId);
        condition1 = `rentals."customerId" = $${list.length}`
    }
    if (gameId) {
        list.push(gameId);
        condition2 = `rentals."gameId" = $${list.length}`
    }
    if (list.length === 2) {
        condition = `WHERE ${condition1} AND ${condition2}`
    } else if (list.length === 1) {
        if (customerId) {
            condition = `WHERE ${condition1}`
        } else {
            condition = `WHERE ${condition2}`
        }
    }
    try {
        const { rows: rentals } = await connection.query(`
                SELECT 
                rentals.*,
                customers.name AS "customerName",
                games.name,
                categories.id as "categoryId",
                categories.name as "categoryName"
                FROM rentals
                JOIN customers ON customers.id=rentals."customerId"
                JOIN games ON games.id=rentals."gameId"
                JOIN categories ON categories.id=games."categoryId"
                ${condition}
      `, list);
        const result = rentals.map(rental => {
            const { customerName, customerId, gameId, name, categoryId, categoryName } = rental;
            delete rental.customerName;
            delete rental.name;
            delete rental.categoryId;
            delete rental.categoryName;
            return (
                {
                    ...rental, customer: {
                        id: customerId,
                        name: customerName
                    },
                    game: {
                        id: gameId,
                        name,
                        categoryId,
                        categoryName
                    }
                }
            )
        })
        res.send(result);

    } catch (error) {
        res.send(error);
    }
}
export async function postRentals(req, res) {
    console.log(dayjs().format('YYYY-MM-DD'))
    const dados = req.body;

    const { error } = rentalSchema.validate(dados);
    if (error) {
        return res.status(400)
    }
    const { customerId, gameId, daysRented } = dados;
    try {
        const { rows: customer } = await connection.query("SELECT * FROM customers WHERE id = $1", [customerId]);
        const { rows: game } = await connection.query("SELECT * FROM games WHERE id = $1", [gameId]);
        const { rows: rentals} = await connection.query(`SELECT * FROM  rentals WHERE "gameId" = $1`, [gameId])
        if (!customer || !game || game[0].stockTotal < 1 || rentals.length >= game[0].stockTotal) {
            return res.status(400);
        }
        await connection.query(
            `INSERT INTO rentals(
                "customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee"
            ) VALUES(${customerId}, ${gameId}, '${dayjs().format('YYYY-MM-DD')}', ${daysRented}, ${null}, ${daysRented * game[0].pricePerDay}, ${null})`
        )
        res.sendStatus(201);
    } catch (error) {
        res.send(error);
    }
}

export async function endedRental(req, res) {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
        return res.sendStatus(400);
    }
    try {
        const { rows: rental } = await connection.query(
            "SELECT * FROM rentals WHERE id = $1",
            [id]
        )
        if (rental.length < 1) {
            return res.sendStatus(404);
        }
        if (rental[0].returnDate) {
            return res.sendStatus(400);
        }
        const diff = dayjs().diff(rental[0].rentDate, 'day');

        const delayFee = diff <= rental.daysRented ? 0 : (rental[0].originalPrice / rental[0].daysRented) * diff;
        console.log(delayFee)

        await connection.query(
            `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`,
            [`'${dayjs()}'`, delayFee, id]
        )
        res.sendStatus(200);
    } catch (error) {
        res.send(error)
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
        return res.sendStatus(400);
    }
    try {
        const { rows: rental } = await connection.query(
            "SELECT * FROM rentals WHERE id = $1", [id]
        )
        if (rental.length < 1) {
            return res.sendStatus(404);
        } else if (rental[0].returnDate) {
            return res.sendStatus(400);
        }
        await connection.query(
            "DELETE FROM rentals WHERE id = $1", [id]
        );
        res.sendStatus(200);
    } catch (error) {
        res.send(error);
    }
}
