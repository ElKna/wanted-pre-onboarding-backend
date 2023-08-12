'use strict'

require('dotenv').config();

const express   = require('express');
const mysql     = require('mysql2');
const connection = mysql.createConnection(require('./database'))
const app       = express();
const port      = 3000;

app.set('port', port)

app.get('/', (req, res) => {
    res.json({
        success: true,
    });
});

app.get('/users', (req, res) => {
    connection.query('SELECT * from Users', (error, rows) => {
        if (error) throw error;
        console.log('User info is: ', rows);
        res.send(rows);
    });
});

app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});