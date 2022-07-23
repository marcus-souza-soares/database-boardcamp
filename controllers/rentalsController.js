import connection from "../db/db.js";

export async function getRentals(req, res) {
    const { customerId } = req.query;
    const { gamerId } = req.query;

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
}
export async function postRentals(req, res) {
    const dados = req.body;
    
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