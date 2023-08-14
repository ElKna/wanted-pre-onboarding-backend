'use strict'

require('dotenv').config();

const express   = require('express');
const mysql     = require('mysql2');
const connection = mysql.createConnection(require('./database'))
const app       = express();
var crypto      = require('crypto');
const port      = 3000;
app.set('port', port)
// Express JSON Parse
app.use(express.json());

app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});

// Sub 1. CreateUser Endpoint
var valid_email     = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+/;
var valid_password  = /^[A-Za-z0-9]{8,25}$/;
app.post('/login', async (req, res) => {
    let body = req.body;

    if (!body.email || !body.password) {
        res.status(400).send('Request must be contained email and password field');
    } else if ((body.email.length > 30) || !valid_email.test(body.email) || !valid_password.test(body.password)) {
        res.status(400).send('Invalid email field(xxx@xxxx, max-length=30) or Invalid password field(Upper, Under, Number, Length: 8~25)');
    } else {
        connection.query(`SELECT * FROM ${process.env.USER_TABLE} WHERE email='${body.email}'`, (error, rows) => {
            if (error) throw error;
            if (rows.length != 0) {
                res.status(400).send('Already exist email');
                return;
            } else {
                var salt            = crypto.randomBytes(16).toString("base64");
                var hashPassword    = crypto.createHash("sha256").update(body.password + salt).digest("hex");
                connection.query(`INSERT INTO ${process.env.USER_TABLE} (email, password, salt) VALUES ('${body.email}', '${hashPassword}', '${salt}')`, (error, rows) => {
                    if (error) throw error;
                    res.status(201).send('Account create complete');
                })
            }
        })
    }
})

// Sub 3. CreateNew EndPoint
app.post('/', (req, res) => {
    if (req.body.hasOwnProperty('TITLE') && req.body.hasOwnProperty('CONTENTS')) {
        connection.query(`INSERT INTO ${process.env.BOARD_TABLE} (TITLE, CONTENTS) VALUES ('${req.body.TITLE}', '${req.body.CONTENTS}')`, (error, rows) => {
            if (error) throw error;
            res.status(201).send(req.body);
        });
    } else {
        res.status(400).send('Request must be contained TITLE and CONTENTS field');
    }
});

// Sub 4. GetAll EndPoint
app.get('/', (req, res) => {
    connection.query(`SELECT * FROM ${process.env.BOARD_TABLE}`, (error, rows) => {
        if (error) throw error;
        res.send(rows);
    });
});

// Sub 5. GetOne EndPoint
app.get('/:id', (req, res) => {
    connection.query(`SELECT * FROM ${process.env.BOARD_TABLE} WHERE BOARD_NO='${req.params.id}'`, (error, rows) => {
        if (error) throw error;
        if (rows.length == 0) {
            res.status(404).send('No exist content');
        } else {
            res.send(rows);
        };
    })
})

// Sub 6. UpdateOne EndPoint
app.post('/:id', (req, res) => {
    if (req.body.hasOwnProperty('TITLE') && req.body.hasOwnProperty('CONTENTS')) {
        connection.query(
            `UPDATE ${process.env.BOARD_TABLE} SET TITLE='${req.body.TITLE}' WHERE BOARD_NO=${req.params.id};`+
            `UPDATE ${process.env.BOARD_TABLE} SET CONTENTS='${req.body.CONTENTS}' WHERE BOARD_NO=${req.params.id};`, (error, rows) => {
                if (error) throw error;
                if (rows[0].affectedRows == 0 && rows[1].affectedRows == 0) {
                    res.status(202).send('Already modified or no exist content');
                } else {
                    res.status(201).send(req.body);
                };
        });
    } else {
        res.status(400).send('Request must be contained TITLE and CONTENTS field');
    }
});

// Sub 7. Delete EndPoint
app.delete('/:id', (req, res) => {
    connection.query(`DELETE FROM ${process.env.BOARD_TABLE} WHERE BOARD_NO=${req.params.id}`, (error, rows) => {
        if (error) throw error;
        if (rows.affectedRows == 0) {
            res.status(202).send('Already deleted or no exist content');
        } else {
            res.send(`${req.params.id} Delete Complete`);
        };
    });
});