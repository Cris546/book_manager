


const URL = "http://localhost:8080/books/";

function getData() {
    const bookID = document.getElementById("bookId").value;
    
    fetch(URL + bookID)
    .then(res => {
        return res.json();
    })
    .then( data => {
        
        displayData(data);
        
        return data;
    })
    .catch(error => console.error(error));
}

function postData(){
    
    newBook = createBook();

    fetch(URL, {
        method: 'POST',
        body: JSON.stringify(newBook),
        headers: { 'Content-Type' : 'application/json'}
    }).then(res => {
        
        return res.text;
    }).then(data => {
        console.log(data);
    })
    .catch(error => console.error(error));
}

function updateData(){
    const currBook = createBook();
    const bookID = document.getElementById("bookId").value;

    fetch(URL + bookID, {
        method: 'PUT',
        body: JSON.stringify(currBook),
        headers: {'Content-Type' : 'application/json'}
    }).then(res => {
        return res.text;
    }).then(data => {
        console.log(data);
    })
    .catch(error => console.error(error));


}

function deleteData(){
    const bookID = document.getElementById("bookId").value;

    fetch(URL + bookID, {
        method: 'DELETE'
    }).catch(error => console.error(error));
}


function createBook(){
    
    const newBook = {
        book_name : document.getElementById("bookName").value,
        book_type : document.getElementById("bookType").value,
        book_genre : document.getElementById("bookGenre").value,
        book_completed : document.getElementById("bookComp").value
    };

    return newBook;
}





function displayData(data){
    
    const bookDiv = document.getElementById("table");
    var tableBodyHTML = "   <tr class= 'table-header'> <th>ID</th> <th>Book Name</th> <th>Book Type</th> <th>Book Genre</th> <th>Book Completed</th></tr>"
    tableBodyHTML += data.map(function(data) {
        return "<tr><td>" + data.id + "</td><td>" + data.book_name + "</td><td>" + data.book_type
        + "</td><td>" + data.book_genre + "</td><td>" + data.book_completed + "</td></tr>";
    }).join("");

    bookDiv.innerHTML = tableBodyHTML;
    
}