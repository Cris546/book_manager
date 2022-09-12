//REST API with CRUD Functionality

//current packages being using
const express = require('express');
const cors = require('cors');
//The database connection is created and established in db_conn.js
const db = require('./db_conn');
const app = express();
var createError = require('http-errors');

//We default to json 
app.use(express.json());

//enable cors to make calls in the browser
app.use(cors({
    origin: '*'
}));


//The first get
//introduces users to the API
app.get("/", (req, res) => {
    res.json({ message: "Cristobal's Book Manager REST API"});
})

//GET Functionality
//Makes an SQL query to retrieve all the data inside the database
//Start of hiearchy
app.get("/books", (req, res, next) => {
    //Send an SQL query to obtain all the data inside the database
    db.query('SELECT * FROM book', (err, rows, fields) => {
        //Check if the error object is defined
        if(err){
            //If so, send it to our middleware error handler
            next(err);

        } 
        //Send the data normally back as the response
        else res.send(rows);
    })
} )

//GET Functionality
//Makes an SQL query to retrieve a specific book using the ID parameter in the URL
app.get("/books/:id", (req, res, next) => {
    //First we check if the ID parameter is a number
    //Since our Primary Key is a number type
    if(verifyData(req.params.id)){
        //If it's not a number, then we pass it into our middleware error handler
        //with a specific error type 
        next(error = {
            type : 'invalid-input'
        })
    }
    else{
        //It makes an SQL query looking for a row with the given ID parameter
        db.query('SELECT * FROM book WHERE id = ?', [req.params.id], (err, rows, fields) => {
            //We check if the database isn't responding
            if(err) {
                //If not, then we pass the error
                next(err);
            }
            //Then we check if the response given was an empty set
            else if(Object.keys(rows).length === 0) next(error = {
                //if so, then we were given an ID that doesn't exist
                //So we pass the error with the specific error type that
                //the user doesn't exist
                type: 'user-not-found'
            })
            else{
                //Finally we respond back with the specific row
                res.send(rows);
                return rows;
            }
            
        })
    }
})
//POST FUNCTIONALITY
//Add a book entry into the database using the request body entry
app.post("/books", (req, res, next) => {
    //First we build the book object using the request body given
    const newBook = {
        book_name : req.body.book_name,
        book_type: req.body.book_type,
        book_genre: req.body.book_genre,
        book_completed: req.body.book_completed
    };
    //Then we query to insert the book object into the database
    db.query('INSERT INTO BOOK SET ? ', newBook, function(error, rows, fields){
        //We check if we got an error back AND if the error is SQL specific
        if(error && error.sqlMessage != undefined) {
            //If so, then we handle the error with the specific error type of
            //invalid input
            error.type = 'invalid-input';
            next(error);
        }
        //Then we check if we got a non SQL error
        else if(error){
            //If so, then pass to be handled by middleware
            next(error);
        }
        else{
            //Finally we respond back to notifying the insertion was a success
            res.send({message: "Insertion complete"});
        }
        
    })

})

//PUT FUNCTIONALITY
//The user can update a specific book entry with the use of an ID parameter
app.put('/books/:id', (req, res, next) => {
    //First we build the new updated book entry from the body
    const updatedBook = {
        book_name : req.body.book_name,
        book_type : req.body.book_type,
        book_genre : req.body.book_genre,
        book_completed : req.body.book_completed
    }
    //We then verify if the ID given is an actual number
    //If not, then we return with the specific error of invalid-input
    if(verifyData(req.params.id)) next(error = {type: 'invalid-input'});
    else{
        //Then we make a query to make the updated changes
        db.query("UPDATE book SET ? WHERE id = ?", [updatedBook, req.params.id], function(error, rows, fields) {
            //We check if the error given back is an SQL error
            if(error && error.sqlMessage != undefined) {
                //if so, then we return back an invalid-input error
                error.type = 'invalid-input';
                next(error);
            }
            //But if it's a non SQL error
            //then we handle error differently
            else if(error) next(error);
            //We notify the user that the update was a success
            else res.send({message: "Update Complete"});
        })
    }
    
})
//DELETE FUNCTIONALITY
//Remove a specific book entry with the given ID parameter
app.delete('/books/:id', (req, res, next) => {
    //Verify if the given ID parameter is a number
    //if not, then handle with a specific error type of invalid-input
    if(verifyData(req.params.id)) next(error = {type: 'invalid-input'});
    else{
        //Else, send the query with the specific ID given to delete the book entry
        db.query("DELETE FROM book WHERE id = ?", req.params.id, function(error, rows, fields) {
            //Check and handle error if thrown
            if(error) next(error);
            //Then notify the user if the deletion was a success
            else res.send({message: "Book deleted"});
        })
    }
    
})

//Quick helper function to verify if the parameter is type 'number'
function verifyData(data){
    //Use the isNaN function to determine if the object is or is not a number
    //Return boolean with:
        //true => the object IS NOT a number
        //false => the object IS a number
    return (isNaN(data));
}

//Error Handler middleware
//we use the next(error) function 
//where the parameter passed in this the error object
app.use((error, req, res, next) => {
    // console.log("Error handler Middleware");
    // console.log("Error type: " + error.type);
    //Use if statemenets to determine error type
    if(error.type == 'invalid-input'){
        //Determine if the error is SQL or non SQL error from input validation
        res.status(400).send({message: error.sqlMessage || "Invalid input for ID OR book creation"});
    }
    else if(error.type == 'user-not-found'){
        //The ID given does not exist in the database
        res.status(404).send({message: "Book not found"});
    }
    else{
        //Connection to database is unreachable
        res.status(500).send({message: "Database not responding"});
    }
})

//Establish and listen on port given
const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port: ' + port + '...'));

module.exports = app;