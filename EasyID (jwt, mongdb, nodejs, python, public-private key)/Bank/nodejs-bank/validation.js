// BALANCE VALIDATION
const joi = require('@hapi/joi')

const registerValidation = data => {
    const schema = joi.object({
        email: joi.string().min(2).max(255).required().email(),
    })
    return schema.validate(data)
}

module.exports.registerValidation = registerValidation;