require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const knex = require('./db.js');
const db = require('./database')(knex);
const body_parser = require('body-parser'); 
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

const test = true;

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || [
                'http://localhost:5173',
                'http://todo-ben.developyn.com.s3-website-eu-west-1.amazonaws.com',
                'http://todo-ben.developyn.com',
                'https://todo-ben.developyn.com'
            ].includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(origin, 'Not allowed by CORS.'));
    }
}));

app.get('/', (req, res) => {
    console.log('request recieved');
    return res.json({ message: `Hello World!` })
});

app.use(
    '/users',
    require('./users')(knex)
);

app.use(
    '/lists',
    require('./lists')(knex)
);

if (test) app.listen(3000, () => console.log('Running on port 3000'));
else module.exports = app;