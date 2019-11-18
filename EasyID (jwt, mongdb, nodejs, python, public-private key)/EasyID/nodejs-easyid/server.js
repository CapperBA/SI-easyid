const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
// Import routes 
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config()

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('Connected to MongoDB')
})

// Middleware
app.use(express.json())
app.use(cors())

// Route middleware
app.use('/api/user', authRoute)
app.use('/api/user', postRoute)

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log('Cannot listen: ', err)
        return
    }
    console.log('EASYID listening to PORT: '+process.env.PORT)
})