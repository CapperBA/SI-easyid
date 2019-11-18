const router = require('express').Router()
const User = require('../model/User')
const verify = require('./verifyToken')
const jwt = require('jsonwebtoken')
const { registerValidation } = require('../validation')

/****** CHECK BANK ******/
router.get('/bank', verify, async (req, res) => {
    // Decoding from token
    const decoded = jwt.decode(req.header('auth-token'), {
        complete: true
    });

    // Checking if the user exist
    const user = await User.findOne({
        email: decoded.payload.email
    })
    if (!user) return res.status(400).json({
        message: 'User is not a customer at the BANK'
    })

    return res.json({
        email: user.email,
        balance: user.balance
    })

})

/****** REGISTER ******/
router.post('/register', async (req, res) => {
    // Validating before creating new user
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({
        message: error.details[0].message
    });

    // Checking if the user is already in the database
    const emailExist = await User.findOne({
        email: req.body.email
    })
    if (emailExist) return res.status(400).send({message: 'Email already exists'})

    // Removing _id in cases where the user tries to deciced its own id
    if (req.body._id) delete req.body._id

    // Creating new user
    const user = new User({
        email: req.body.email,
        balance: req.body.balance
    })

    try {
        const savedUser = await user.save()
        return res.status(200).send({
            user: user._id,
            message: 'User at the BANK has been created'
        })
    } catch (err) {
        return res.status(400).send(err)
    }
})

module.exports = router