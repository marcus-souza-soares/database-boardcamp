import joi from 'joi';

const clientSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().required().min(10).max(11),
    cpf: joi.string().length(11).required(),
    birthday: joi.date().required()
})

export default clientSchema;