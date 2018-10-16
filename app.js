const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const users = require('./routes/user.route')
const quizzes = require('./routes/quiz.route')


// --- APP SETUP - db, passport auth, bodyparser

let dev_db_url = 'mongodb://admin:abc123@ds231723.mlab.com:31723/quiz'
let mongoDB = process.env.MONGODB_URI || dev_db_url
mongoose.connect(mongoDB, { useNewUrlParser: true }).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
)

const app = express()

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Content-Type', 'application/json')

    // Pass to next layer of middleware
    next();
});

app.use(passport.initialize())
require('./passport')(passport)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// --- ROUTES

app.use('/api/users', users)
app.use('/api/quizzes', quizzes)
app.get('/', function(req, res) {
    res.send('hello');
})


// --- RUN

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})