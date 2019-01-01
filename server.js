const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
var knex = require('knex');

// Salt for calculating password hash
const saltRounds = 10;
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



// env variable to retrieve clarifai api key
const env = require('dotenv').config().parsed;

// Create express app
const app = express();

// middleware method to parse request from user
app.use(bodyParser.json());

// So front-end can make request to our server with trust.
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

app.get('/', (req, res) => {
    res.json(db.users);
})

app.get('/clarifaiApiKey', (req, res) => {
    res.json(env.ClarifaiApiKey);
})

app.post('/signin', (req, res) => {
    const { email, password }  = req.body;

    database('login').select('*')
        .where({
            email: email
        })
        .then(loginInfo => {
            const isValid = bcrypt.compareSync(password, loginInfo[0].hash);
            if (isValid){
                database('users')
                    .select('*')
                    .where('email', '=', email)
                    .then(userArray => {
                        res.json(userArray[0]);
                    })
                    .catch(err => res.json('Unable to get user'));
            } else {
                res.status(400).json('Wrong signin info');  //
            }
        })
        .catch(err => res.status(400).json('Wrong signin info')); // Error is caught when wrong email, db can't find email.
})

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    const hash = calculatePasswordHash(password);
    database.transaction(trx => {
        trx('login').insert({
                email: email,
                hash: hash
            })
            .returning('*')
            .then(() => {
                return trx('users').insert({
                            name: name,
                            email: email,
                            joined: new Date()
                        })
                        .returning('*')
                        .then(userArray =>  {
                            res.json(userArray[0]);
                        })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    }).catch(err => res.status(400).json('Unable to register user'));
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    database('users')
        .select('*')
        .where({
            id: id
        })
        .then(userArray => {
            if (userArray.length) {
                res.json(userArray[0]);
            } else {
                res.status(400).json('User not found');
            }
        })
        .catch(err => res.status(400).json('Error retrieving user'));
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    database('users')
        .where({id: id})
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.json('unable to update entries'));
})


app.listen(3000, () => {
    console.log('server is running');
})

/*
    Helper functions section
 */

function calculatePasswordHash(password) {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}
