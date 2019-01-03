const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const env = require('dotenv').config().parsed;

//controllers
const signin = require('./controllers/Signin');
const register = require('./controllers/Register');
const profileGet = require('./controllers/ProfileGet');
const image = require('./controllers/Image');

// Uses knexJS to connect to database
const database = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : '',
        password : '',
        database : 'face-recognition-app'
    }
});

// Create express app
const app = express();

// middleware method to parse request from user
app.use(bodyParser.json());

// So front-end can make request to our server with trust (cross origin)
app.use(cors());

// db of users
const db = {
    users : [
        {
            id: '123',
            name: 'cody',
            email: 'cody@gmail.com',
            password: 'cody',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'rem',
            email: 'rem@gmail.com',
            password: 'rem',
            entries: 0,
            joined: new Date()
        }
    ]
};

app.get('/', (req, res) => { res.json(db.users) })

// handleSignin is function that returns a function, hence doesn't need to inject req and res as dependency-- method 1 (matter of preference)
app.post('/signin', signin.handleSignin(database, bcrypt))

//Pass req and res as dependency into handleRegister -- method 2 (matter of preference)
app.post('/register', (req, res) => { register.handleRegister(req, res, database, bcrypt) })

app.get('/profile/:id', (req, res) => { profileGet.handleProfileGet(req, res, database) })

app.put('/image', (req, res) => { image.handleImage(req, res, database) })

app.post('/apiCall', (req, res) => {image.handleClarifaiApiCall(req, res)})

app.listen(env.PORT, () => {
    console.log(`server is running on port ${env.PORT}`);
})

