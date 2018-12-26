const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

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
    res.json(db.users)
})

app.get('/clarifaiApiKey', (req, res) => {
    res.json(env.ClarifaiApiKey);
})

app.post('/signin', (req, res) => {
    const { email, password }  = req.body;
    if(email === db.users[0].email && password === db.users[0].password) {
        res.json('success');
    } else {
        res.status(400).json('bad request, wrong signin info');
    }
})

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    db.users.push({
        id: '1234',
        name,
        email,
        password,
        entries: 0,
        joined: new Date()
    });

    res.json(db.users[db.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.users.forEach(user => {
       if (user.id === id ) {
           return res.json(user);
       }
    });
    return res.status(404).json('User not found');
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db.users.forEach(user => {
        if (user.id === id ) {
            user.entries++;
            return res.json(user.entries);
        }
    });
    return res.status(404).json('User not found');
})


app.listen(3000, () => {
    console.log('server is running');
})