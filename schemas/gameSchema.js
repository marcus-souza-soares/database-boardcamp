import e from 'express';
import joi from 'joi'

const schemaGames = joi.object(
    {
        name: joi.string().required(),
        image: joi.string().required(),
        stockTotal: joi.number().min(1),
        categoryId: joi.number().required(),
        pricePerDay: joi.number().min(1).required(),
    }
);

export default schemaGames;