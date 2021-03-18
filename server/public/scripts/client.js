$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
  $('#bookShelf').on('click', '.deleteButton', deleteBook);
  $('#bookShelf').on('click', '.readButton', readBook);
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    let readHTML = `<button data-id="${ book.id }" class="readButton">Read</button>`;
    if( book.isRead ){
      readHTML = "Read";
    }
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td><button data-id=${book.id} class="deleteButton">Delete</button></td>
        <td>${readHTML}</td>
      </tr>
    `);
  }
}

function deleteBook (){
  const myId = $(this).data( 'id' );
  console.log( 'in deleteBook', myId );
  //ajax call of type DELETE to update db
  $.ajax({
    method: 'DELETE',
    url: '/books/' + myId
  }).then( function(response){
    console.log( 'back from delete with:', response );
    refreshBooks();
  }).catch( function(err){
    console.log( err );
    alert( 'nope' );
  })
}//end deleteBook

function readBook (){
  const myId = $(this).data( 'id' );
  console.log( 'in readBook', myId );
  //ajax call of type DELETE to update db
  $.ajax({
    method: 'PUT',
    url: '/books/' + myId
  }).then( function(response){
    console.log( 'back from PUT:', response );
    refreshBooks();
  }).catch( function(err){
    console.log( err );
    alert( 'nope' );
  })
}//end deleteBook