const express = require('express');
const cors = require('cors');
const db = require('./db_conn');
const app = express();

app.use(express.json());

app.use(cors({
    origin: '*'
}));

app.get("/", (req, res) => {
    res.json({ message: "Cristobal's Book Manager REST API"});
})


app.get("/books", (req, res) => {
    db.query('SELECT * FROM book', (err, rows, fields) => {
        if(err) res.status(500).send({message: err.code});
        
        res.send(rows);
    })
} )

app.get("/books/:id", (req, res) => {
    db.query('SELECT * FROM book WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if(err) res.status(500).send({message: err.code});
        res.send(rows);
        
    })
})

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port: ' + port + '...'));

module.exports = app;