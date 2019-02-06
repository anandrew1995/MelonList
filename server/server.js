const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const RateLimit = require('express-rate-limit')

const config = require('./config')
const index = require('./routes/index')
const charts = require('./routes/charts')
// const users = './routes/users'

const app = express()

const port = process.env.PORT || 3000

//Connect to DB
mongoose.connect(config.database, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
    console.log(`Connected to ${config.database}`)
})

//Allow CORS
app.use(cors({
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE'
}))

//Morgan logger
app.use(morgan('dev'))

//View Engine
app.use(express.static(path.join(__dirname, '../client/dist')))
app.set('view engine', 'html')

//Body Parser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//Set a rate limit for requests (100 per min)
var limiter = new RateLimit({
    windowMs: 60*1000,
    max: 100,
    delayMs: 0
})
app.use(limiter)

app.use('/', index)
app.use('/api/charts', charts)

app.use((req, res, next) => {
    const error = new Error('404 Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    .json({
        error: {
            success: false,
            message: error.message
        }
    })
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

module.exports = app
