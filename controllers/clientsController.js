
import connection from "../db/db.js";
import joi from 'joi'
// {
//     id: 1,
//     name: 'João Alfredo',
//     phone: '21998899222',
//     cpf: '01234567890',
//     birthday: '1992-10-05'
//   }

export async function createClient(req, res){
    
}

export async function getClients(req, res){
    const {rows: clients} = await connection.query('SELECT * FROM customers')
    res.send(clients);
}

export async function updateClient(req, res){

}