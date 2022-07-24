import connection from "../db/db.js";
import rentalSchema from "../schemas/rentalsSchema.js"
import dayjs from 'dayjs';

export async function getRentals(req, res) {
    const { customerId } = req.query;
    const { gamerId } = req.query;
    try {
        if (customerId) {
            const { rows: rentalsById } = await connection.query("SELECT * FROM rentals WHERE customerId = $1", [customerId]);
            return res.send(rentalsById)
        } else if (gamerId) {
            const { rows: rentalsById } = await connection.query("SELECT * FROM rentals WHERE gamerId = $1", [gamerId]);
            return res.send(rentalsById)
        } else {
            const { rows: rentals } = await connection.query("SELECT * FROM rentals");
            return res.send(rentals)
        }
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
        if (!customer || !game || game[0].stockTotal < 1) {
            return res.status(400);
        }
        await connection.query(
            `INSERT INTO rentals (
            "customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee"
        ) VALUES (${customerId}, ${gameId}, '${dayjs().format('YYYY-MM-DD')}', ${daysRented}, ${null}, ${daysRented * game[0].pricePerDay}, ${null})`
        )
        res.sendStatus(201);
    } catch (error) {
        res.send(error);
    }
}

export async function endedRental(req, res) {
    const { id } = req.params;

    // console.log(dayjs().add(1, "day"))
    // console.log(dayjs().diff('2022-07-20','day'))
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

        const delayFee = dayjs().diff(rental[0].rentDate) <= 0 ? 0 : dayjs().diff(rental[0].rentDate, 'day');
        console.log(delayFee)

        await connection.query(
            `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`,
            [`'${dayjs()}'`, (rental[0].originalPrice / rental[0].daysRented)
                * (rental[0].daysRented + delayFee), id]
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
// {
//     id: 1,
//     customerId: 1,
//     gameId: 1,
//     rentDate: '2021-06-20',    // data em que o aluguel foi feito
//     daysRented: 3,             // por quantos dias o cliente agendou o aluguel
//     returnDate: null,          // data que o cliente devolveu o jogo (null enquanto não devolvido)
//     originalPrice: 4500,       // preço total do aluguel em centavos (dias alugados vezes o preço por dia do jogo)
//     delayFee: null             // multa total paga por atraso (dias que passaram do prazo vezes o preço por dia do jogo)
//   }