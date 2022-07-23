import connection from "../db/db.js";
import clientSchema from '../schemas/customersSchema.js';

export async function createClient(req, res) {
    const newClient = req.body;
    const { error } = clientSchema.validate(newClient);
    try {
        if (error) {
            return res.sendStatus(400)
        }
        const { name, phone, cpf, birthday } = newClient;
        const { rows: clientByCpf } = await connection.query('SELECT * FROM customers WHERE cpf = $1', [newClient.cpf]);
        if (clientByCpf.length > 0) {

            return res.sendStatus(409);
        }
        await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ('${name}', '${phone}', '${cpf}', '${birthday}')`)
        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(404);
    }
}



export async function getClients(req, res) {
    const { cpf } = req.query;
    try {
        if (cpf) {
            const { rows: clientsByCpf } = await connection.query(`SELECT * FROM customers WHERE cpf LIKE '${cpf}%'`)
            return res.send(clientsByCpf);
        }
        const { rows: clients } = await connection.query(`SELECT * FROM customers`)
        return res.send(clients);
    } catch (error) {
        res.sendStatus(400);
    }
}



export async function getClientsById(req, res) {
    const { id } = req.params;
    try {
        const { rows: clientsById } = await connection.query(`SELECT * FROM customers WHERE id = $1`, [id])
        return res.send(clientsById);
    } catch (error) {
        res.sendStatus(404);
    }
}



export async function updateClient(req, res) {
    const { id } = req.params;

    const clientUpdate = req.body;

    if (isNaN(parseInt(id))) {
        return res.sendStatus(400);
    }
    const { error } = clientSchema.validate(clientUpdate);
    if (error) {
        return res.sendStatus(400)
    }
    const { name, phone, cpf, birthday } = clientUpdate;
    try {
        const { rows: clientByCpf } = await connection.query(
            'SELECT * FROM customers WHERE cpf = $1 AND id = $2',
            [clientUpdate.cpf, id]
        );
        if (clientByCpf.length > 0) {
            return res.sendStatus(409);
        }
        await connection.query(
            `UPDATE customers SET 
        name = $1,
        phone = $2,
        cpf = $3,
        birthday = $4 
        WHERE id = $5`,
            [name, phone, cpf, birthday, id]
        )
        res.sendStatus(200);
    } catch (error) {
        res.status(400).send(error, 'Não foi possível atualizar o cliente!')
    }
}