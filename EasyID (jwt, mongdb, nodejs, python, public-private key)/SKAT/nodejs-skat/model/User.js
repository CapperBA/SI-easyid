const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    debt: {
        type: Number,
        default: 0.00
    }
})

module.exports = mongoose.model('Skat-customers', userSchema)