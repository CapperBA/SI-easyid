const jwt = require('jsonwebtoken')
const fs = require('fs')

module.exports = function (req, res, next) {
    const token = req.header('auth-token')
    if (!token) return res.status(401).json({
        message: 'Access denied. Remember to set \'auth-token\' in the header'
    })

    const publicKey = fs.readFileSync('./public.key', 'utf8')

    try {
        const verified = jwt.verify(token, publicKey, {
            expiresIn: '1h',
            algorithm: ['RS256']
        })
        req.user = verified
        next()
    } catch (err) {
        return res.status(400).json({
            message: 'Invalid token'
        })
    }
}