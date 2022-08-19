


const URL = "http://localhost:8080/books/";

function getData() {
    fetch(URL)
    .then(res => {
        return res.json();
    })
    .then( data => {
        
        displayData(data);
    })
    .catch(error => console.error(error));
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