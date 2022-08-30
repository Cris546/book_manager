const express = require('express');
const cors = require('cors');
const db = require('./db_conn');
const app = express();
var createError = require('http-errors');

app.use(express.json());

app.use(cors({
    origin: '*'
}));



app.get("/", (req, res) => {
    res.json({ message: "Cristobal's Book Manager REST API"});
})


app.get("/books", (req, res, next) => {
    db.query('SELECT * FROM book', (err, rows, fields) => {
        if(err){
            
            next(err);

        } 
        
        else res.send(rows);
    })
} )

app.get("/books/:id", (req, res, next) => {
    if(verifyData(req.params.id)){
        next(error = {
            type : 'invalid-input'
        })
    }
    else{
        db.query('SELECT * FROM book WHERE id = ?', [req.params.id], (err, rows, fields) => {
            if(err) {
                next(err);
            }
            else if(Object.keys(rows).length === 0) next(error = {
                type: 'user-not-found'
            })
            else{
                res.send(rows);
                return rows;
            }
            
        })
    }
})

app.post("/books", (req, res, next) => {
    const newBook = {
        book_name : req.body.book_name,
        book_type: req.body.book_type,
        book_genre: req.body.book_genre,
        book_completed: req.body.book_completed
    };
    db.query('INSERT INTO BOOK SET ? ', newBook, function(error, rows, fields){
        if(error && error.sqlMessage != undefined) {
            error.type = 'invalid-input';
            next(error);
        }
        else if(error){
            next(error);
        }
        else{
            res.send({message: "Insertion complete"});
        }
        
    })

})

app.put('/books/:id', (req, res, next) => {
    const updatedBook = {
        book_name : req.body.book_name,
        book_type : req.body.book_type,
        book_genre : req.body.book_genre,
        book_completed : req.body.book_completed
    }
    if(verifyData(req.params.id)) next(error = {type: 'invalid-input'});
    else{
        db.query("UPDATE book SET ? WHERE EXISTS(SELECT * FROM book WHERE id = ?)", [updatedBook, req.params.id], function(error, rows, fields) {
            if(error && error.sqlMessage != undefined) {
                error.type = 'invalid-input';
                next(error);
            }
            else if(error) next(error);
            else res.send({message: "Update Complete"});
        })
    }
    
})

app.delete('/books/:id', (req, res, next) => {
    if(verifyData(req.params.id)) next(error = {type: 'invalid-input'});
    else{
        db.query("DELETE FROM book WHERE id = ?", req.params.id, function(error, rows, fields) {
        
            if(error) next(error);
            else res.send("Book deleted");
        })
    }
    
})

function verifyData(data){
    return (isNaN(data));
}

app.use((error, req, res, next) => {
    // console.log("Error handler Middleware");
    // console.log("Error type: " + error.type);
    if(error.type == 'invalid-input'){
        res.status(400).send({message: error.sqlMessage || "Invalid input for ID OR book creation"});
    }
    else if(error.type == 'user-not-found'){
        res.status(404).send({message: "Book not found"});
    }
    else{
        res.status(500).send({message: "Database not responding"});
    }
})

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port: ' + port + '...'));

module.exports = app;