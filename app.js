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