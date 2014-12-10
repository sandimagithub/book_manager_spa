var bookListTemplate;
var editBookTemplate;
var newBookTemplate;

//Compile all templates on document ready

(function() {
	var bookListTemplateSource = $("#book-list-template").html();
	bookListTemplate = Handlebars.compile(bookListTemplateSource);

	var editBookTemplateSource = $("#edit-book-template").html();
	editBookTemplate = Handlebars.compile(editBookTemplateSource);

	var newBookTemplateSource = $("#new-book-template").html();
	newBookTemplate = Handlebars.compile(newBookTemplateSource);
})();

//we are setting up a book "collection" of books (Backbone does this)
var Books = Backbone.Collection.extend({
	url: "http://daretodiscover.net/books"
});

// we are setting up a book "Model"
var Book = Backbone.Model.extend({
	urlRoot:"http://daretodiscover.net/books"
})

// we are setting up a book "View", using a key value pair - booklist is to show all books
var BookList = Backbone.View.extend({
	el: "#container", 
	render: function() {
		//fetch is a function, through backbone, that accepts an object, uses the success error syntax
			var that = this;
			books.fetch({
				success: function () {
						var html = bookListTemplate({
							allBooks: books.models
						});

						// $("#container").html(html);
						//alternative way to write the same code line above in javascript. 
						that.$el.html(html);
				}

			});
		}
});

//Set up a New Book View
var NewBook = Backbone.View.extend({
	el: "#container",
	render: function (){
		var html = newBookTemplate();

		$("#container").html(html);
	},
	// key value pair of the event object 
	// "saveBook" in quotes is backbone specific syntax for key value pairs
	events: {
		"click #submit-book": "saveBook"
	},
	saveBook: function() {
		var that = this; 
		var book = new Book();
		var bookInfo = {
			title: $("#new-title").val(),
			author: $("#new-author").val(),
			release_date: $("#new-release").val(),
			image: $("#new-image").val()
		};
			book.save(bookInfo, {
				success: function() {
						router.navigate("/", {
							trigger: true
						});
						that.undelegateEvents();
				}
			});
	}
});

//Set up edit Book View
var EditBook = Backbone.View.extend({
	el: "#container", 
	render: function(id) {
		var book = new Book({
			id: id
		});

//grab things from database using backbone (fetch is backbone specific)
book.fetch({
	success: function(){
		var html = editBookTemplate({
						//gettig the book info and passing it in 
						bookInfo: book
					});
		$("#container").html(html);
	}
});
},
events: {
	"click .submit-book-edits": "editBook",
	"click .delete-book": "deleteBook"
},
editBook: function(event) {
	var that = this; 
	var book = new Book();
	var bookInfo = {
		id: event.target.id,
		title: $("#edit-title").val(),
		author: $("#edit-author").val(),
		release_date: $("#edit-release").val(),
		image: $("#edit-image").val()
	};
	book.save(bookInfo, {
		success: function() {
			router.navigate("/", {
				trigger :true
			});
			that.undelegateEvents();
		}
	});
},
deleteBook: function(event){
	var that = this; 
					// we need to instantiate the book with the id
					var book = new Book({
					id: event.target.id
				});

book.destroy ({
	success: function() {
		router.navigate("/", {
			trigger: true
		});
		that.undelegateEvents();
			}
		});
	}
});



//here we instantiate a new collection of Books
var books = new Books();

//Set up routes

var Router = Backbone.Router.extend({
	routes: {
		"":"index",
		"edit/:id":"edit_book",
		"new":"new_book"
	}
});

var router = new Router();

//Defining index route 
router.on("route:index", function() {
	var booklist = new BookList();
	booklist.render();
});

//Defining edit book route
router.on("route:edit_book", function(id) {
	//we are instantiate a new Book, specifically only one record and therefore, we have to pass in an id
	var editbook = new EditBook();
		editbook.render(id);
	});
	
//Show new book form
router.on("route:new_book", function() {
	var newbook = new NewBook();
	newbook.render();
	
});

//Start the history

Backbone.history.start();