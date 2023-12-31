'use strict'

require('dotenv').config();

const express   = require('express');
const mysql     = require('mysql2');
const connection = mysql.createConnection(require('./database'));
const app       = express();
const jwt       = require("jsonwebtoken");
var crypto      = require('crypto');
const port      = 3000;
app.set('port', port);
// Express JSON Parse
app.use(express.json());

app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});

// Sub 1. CreateUser Endpoint
var valid_email     = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+/;
var valid_password  = /^[A-Za-z0-9]{8,25}$/;
app.post('/users', async (req, res) => {
    let body = req.body;
    if (!body.email || !body.password) {
        res.status(400).send('Request must be contained email and password field');
    } else if ((body.email.length > 30) || !valid_email.test(body.email) || !valid_password.test(body.password)) {
        res.status(400).send('Invalid email field(xxx@xxxx, max-length=30) or Invalid password field(Upper, Under, Number, Length: 8~25)');
    } else {
        connection.query(`SELECT * FROM user WHERE email='${body.email}'`, (error, rows) => {
            if (error) throw error;
            if (rows.length != 0) {
                res.status(400).send('Already exist email');
                return;
            } else {
                var salt            = crypto.randomBytes(16).toString("base64");
                var hashPassword    = crypto.createHash("sha256").update(body.password + salt).digest("hex");
                connection.query(`INSERT INTO user (email, password, salt) VALUES ('${body.email}', '${hashPassword}', '${salt}')`, (error, rows) => {
                    if (error) throw error;
                    res.status(201).send('Account create complete');
                })
            }
        })
    }
})

// Sub 2. GetUser Endpoint
const secretKey     = require('./jwt_support').secretKey;
const options       = require('./jwt_support').option;
app.post('/login', async (req, res) => {
    let body = req.body;
    if (!body.email || !body.password) {
        res.status(400).send('Request must be contained email and password field');
    } else if ((body.email.length > 30) || !valid_email.test(body.email) || !valid_password.test(body.password)) {
        res.status(400).send('Invalid email field(xxx@xxxx, max-length=30) or Invalid password field(Upper, Under, Number, Length: 8~25)');
    } else {
        connection.query(`SELECT * FROM user WHERE email='${body.email}'`, (error, rows) => {
            if (error) throw error;
            var hashPassword = crypto.createHash("sha256").update(body.password + rows[0].salt).digest("hex");
            if (hashPassword == rows[0].password) {
                const token = jwt.sign({user: `${body.email}`}, secretKey, options);
                res.status(201).send(token)
            } else {
                res.status(401).send('Invalid email or password');
            }
        })
    }
})

// Sub 3. CreateNew EndPoint
app.post('/', async (req, res) => {
    let body = req.body;
    try {
        let token = req.rawHeaders[1].split(' ')[1];
        let username = jwt.verify(token, secretKey).user;
        if (body.hasOwnProperty('title') && body.hasOwnProperty('contents')) {
            connection.query(`INSERT INTO board (title, contents, user) VALUES ('${req.body.title}', '${req.body.contents}', '${username}')`, (error, rows) => {
                if (error) throw error;
                res.status(201).send(
                    {
                        "board_id": `${rows.insertId}`,
                        "title": `${body.title}`,
                        "contents": `${body.contents}`,
                        "user": `${username}`
                    });
            });
        } else {
            res.status(400).send('Request must be contained title and contents field');
        }
    } catch (err) {
        if (err.message === 'jwt expired') {
            res.status(401).send('Token expired');
        } else if (err.message === 'invalid token') {
            res.status(401).send('Invalid token');
        } else {
            res.status(401).send('Request must be contained token');
        }
    }
});

// Sub 4. GetAll EndPoint
app.get('/', async (req, res) => {
    connection.query(`SELECT * FROM board`, (error, rows) => {
        if (error) throw error;
        res.send(rows);
    });
});

// Sub 5. GetOne EndPoint
app.get('/:id', async (req, res) => {
    connection.query(`SELECT * FROM board WHERE board_no='${req.params.id}'`, (error, rows) => {
        if (error) throw error;
        if (rows.length == 0) {
            res.status(404).send('No exist content');
        } else {
            res.send(rows);
        };
    })
})

// Sub 6. UpdateOne EndPoint
app.post('/:id', async (req, res) => {
    let body = req.body;
    try {
        let token = req.rawHeaders[1].split(' ')[1];
        let username = jwt.verify(token, secretKey).user;
        if (!body.hasOwnProperty('title') || !body.hasOwnProperty('contents')) {
            res.status(400).send('Request must be contained title and contents field');
        } else {            connection.query(`SELECT * FROM board WHERE board_no=${req.params.id}`, (error, rows) => {
                try {
                    if (rows[0].user == username) {
                        connection.query(
                            `UPDATE board SET title='${req.body.title}' WHERE board_no=${req.params.id};`+
                            `UPDATE board SET contents='${req.body.contents}' WHERE board_no=${req.params.id};`, (error, rows) => {
                                if (error) throw error;
                                if (rows[0].changedRows == 0 && rows[1].changedRows == 0) {
                                    res.status(202).send('Already modified');
                                } else {
                                    res.status(201).send(
                                        {
                                            "board_id": `${req.params.id}`,
                                            "title": `${body.title}`,
                                            "contents": `${body.contents}`,
                                            "user": `${username}`
                                        });
                                };
                        });
                    } else {
                        res.status(401).send('You have not permission to update and delete')
                    }
                } catch (err) {
                    res.status(404).send('No exist content');
                }
            })
        }
    } catch (err) {
        if (err.message === 'jwt expired') {
            res.status(401).send('Token expired');
        } else if (err.message === 'invalid token') {
            res.status(401).send('Invalid token');
        } else {
            res.status(401).send('Request must be contained token');
        }
    }
});

// Sub 7. Delete EndPoint
app.delete('/:id', async (req, res) => {
    try {
        let token = req.rawHeaders[1].split(' ')[1];
        let username = jwt.verify(token, secretKey).user;
        connection.query(`SELECT * FROM board WHERE board_no=${req.params.id}`, (error, rows) => {
            try {
                if (rows[0].user == username) {
                    connection.query(`DELETE FROM board WHERE board_no=${req.params.id}`, (error, rows) => {
                        if (error) throw error;
                        if (rows.affectedRows == 0) {
                            res.status(202).send('Already deleted');
                        } else {
                            res.send(`${req.params.id} Delete Complete`);
                        };
                    });
                } else {
                    res.status(401).send('You have not permission to update and delete')
                }
            } catch (err) {
                res.status(404).send('No exist content');
            }
        })
    } catch (err) {
        if (err.message === 'jwt expired') {
            res.status(401).send('Token expired');
        } else if (err.message === 'invalid token') {
            res.status(401).send('Invalid token');
        } else {
            res.status(401).send('Request must be contained token');
        }
    }
});