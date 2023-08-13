'use strict'

require('dotenv').config();

const express   = require('express');
const mysql     = require('mysql2');
const connection = mysql.createConnection(require('./database'))
const app       = express();
const port      = 3000;
app.set('port', port)

app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});

// Sub 4. Get EndPoint
app.get('/', (req, res) => {
    connection.query(`SELECT * from ${process.env.TABLE_NAME}`, (error, rows) => {
        if (error) throw error;
        res.send(rows);
    });
});

// Sub 7. Delete EndPoint
app.delete('/:id', (req, res) => {
    connection.query(`DELETE FROM ${process.env.TABLE_NAME} WHERE BOARD_NO=${req.params.id}`, (error, rows) => {
        if (error) throw error;
        res.send(`${req.params.id} Delete Complete`);
    });
});