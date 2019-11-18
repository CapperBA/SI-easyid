const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
// Import routes 
const skatRoute = require('./routes/skat')

dotenv.config()

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('Connected to MongoDB')
})

// Middleware
app.use(express.json())

// Route middleware
app.use('/api/user', skatRoute)

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log('Cannot listen: ' + err)
        return
    }
    console.log('SKAT is listening to PORT: ' + process.env.PORT)
})