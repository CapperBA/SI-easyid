const router = require('express').Router()
const User = require('../model/User')
const fs = require('fs')

const {
    registerValidation,
    loginValidation
} = require('../validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    if (emailExist) return res.status(400).json({
        message: 'Email already exists'
    })

    // Hashing password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // Removing _id in cases where the user tries to deciced its own id
    if (req.body._id) delete req.body._id

    // Creating new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })

    try {
        const savedUser = await user.save()
        return res.status(200).json({
            user: user._id,
            message: 'User at EASYID has been created'
        })
    } catch (err) {
        return res.status(400).json({
            message: err
        })
    }
})

/****** LOGIN ******/
router.post('/login', async (req, res) => {
    // Validating
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({
        message: error.details[0].message
    });

    // Checking if the email does NOT exists
    const user = await User.findOne({
        email: req.body.email
    })
    if (!user) return res.status(400).json({
        message: 'Email is not found'
    })

    // Checking if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).json({
        message: 'Password is invalid'
    })

    const privateKey = fs.readFileSync('./private.key', 'utf8')

    // Creating and signing token
    const token = jwt.sign({
        _id: user._id,
        email: user.email
    }, privateKey, {
        expiresIn: '1h',
        algorithm: "RS256"
    })

    return res.header('auth-token', token).json({
        token: token
    })

})


module.exports = router