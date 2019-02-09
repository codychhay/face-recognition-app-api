const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
//const env = require('dotenv').config().parsed;

//controllers
const signin = require('./controllers/Signin');
const register = require('./controllers/Register');
const profileGet = require('./controllers/ProfileGet');
const image = require('./controllers/Image');

// Uses knexJS to connect to database
const database = knex({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

// Create express app
const app = express();

// middleware method to parse request from user
app.use(bodyParser.json());

// So front-end can make request to our server with trust (cross origin)
app.use(cors());

app.get('/', (req, res) => { res.json("It's working") })

// handleSignin is function that returns a function, hence doesn't need to inject req and res as dependency-- method 1 (matter of preference)
app.post('/signin', signin.handleSignin(database, bcrypt))

//Pass req and res as dependency into handleRegister -- method 2 (matter of preference)
app.post('/register', (req, res) => { register.handleRegister(req, res, database, bcrypt) })

app.get('/profile/:id', (req, res) => { profileGet.handleProfileGet(req, res, database) })

app.put('/image', (req, res) => { image.handleImage(req, res, database) })

app.post('/apiCall', (req, res) => {image.handleClarifaiApiCall(req, res)})

// Reading from .env file
// app.listen(env.PORT, () => {
//     console.log(`server is running on port ${env.PORT}`);
// })

// Another way to use environment var without library
//Note: when start the server, type PORT=3000 node server.js

app.listen(process.env.PORT || 3000, () => {
    console.log(`server is running on port ${process.env.PORT || 3000}`);
})

