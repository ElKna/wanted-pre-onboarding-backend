'use strict'

require('dotenv').config();

const express   = require('express');
const mysql     = require('mysql2');
const connection = mysql.createConnection(require('./database'))
const app       = express();
const port      = 3000;
app.set('port', port)
// Express JSON Parse
app.use(express.json());

app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});

// Sub 3. CreateNew EndPoint
app.post('/', (req, res) => {
    if (req.body.hasOwnProperty('TITLE') && req.body.hasOwnProperty('CONTENTS')) {
        connection.query(`INSERT INTO ${process.env.TABLE_NAME} (TITLE, CONTENTS) VALUES ('${req.body.TITLE}', '${req.body.CONTENTS}')`, (error, rows) => {
            if (error) throw error;
            res.status(201).send(req.body)
        });
    } else {
        res.status(202).send('Request must be contained TITLE and CONTENTS field')
    }
});

// Sub 4. GetAll EndPoint
app.get('/', (req, res) => {
    connection.query(`SELECT * FROM ${process.env.TABLE_NAME}`, (error, rows) => {
        if (error) throw error;
        res.send(rows);
    });
});

// Sub 5. GetOne EndPoint
app.get('/:id', (req, res) => {
    connection.query(`SELECT * FROM ${process.env.TABLE_NAME} WHERE BOARD_NO='${req.params.id}'`, (error, rows) => {
        if (error) throw error;
        if (rows.length == 0) {
            res.status(204).send('No exist content')
        } else {
            res.send(rows)
        };
    })
})

// Sub 6. UpdateOne EndPoint
app.post('/:id', (req, res) => {
    if (req.body.hasOwnProperty('TITLE') && req.body.hasOwnProperty('CONTENTS')) {
        connection.query(
            `UPDATE ${process.env.TABLE_NAME} SET TITLE='${req.body.TITLE}' WHERE BOARD_NO=${req.params.id};`+
            `UPDATE ${process.env.TABLE_NAME} SET CONTENTS='${req.body.CONTENTS}' WHERE BOARD_NO=${req.params.id};`, (error, rows) => {
                if (error) throw error;
                if (rows[0].affectedRows == 0 && rows[1].affectedRows == 0) {
                    res.status(202).send('Already modified or no exist content')
                } else {
                    res.status(201).send(req.body)
                };
        });
    } else {
        res.status(202).send('Request must be contained TITLE and CONTENTS field')
    }
});

// Sub 7. Delete EndPoint
app.delete('/:id', (req, res) => {
    connection.query(`DELETE FROM ${process.env.TABLE_NAME} WHERE BOARD_NO=${req.params.id}`, (error, rows) => {
        if (error) throw error;
        if (rows.affectedRows == 0) {
            res.status(202).send('Already deleted or no exist content')
        } else {
            res.send(`${req.params.id} Delete Complete`)
        };
    });
});