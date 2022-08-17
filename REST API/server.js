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

app.post("/books", (req, res) => {
    const newBook = {
        book_name : req.body.book_name,
        book_type: req.body.book_type,
        book_genre: req.body.book_genre,
        book_completed: '0'
    };

    db.query('INSERT INTO BOOK SET ? ', newBook, function(error, rows, fields){
        if(error) throw error;
        return res.send("Insertion complete");
    })

})

app.put('/books/:id', (req, res) => {
    const updatedBook = {
        id : req.params.id,
        book_name : req.body.book_name,
        book_type : req.body.book_type,
        book_genre : req.body.book_genre,
        book_completed : req.body.book_completed
    }

    db.query("UPDATE book SET ? WHERE id = ?", [updatedBook, updatedBook.id], function(error, rows, fields) {
        if(error) throw error;

        return res.send("Update Complete");
    })
})

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port: ' + port + '...'));

module.exports = app;