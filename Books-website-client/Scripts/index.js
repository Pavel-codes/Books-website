import config from './config.js'; 

const allData = [];
const allBooksDisplay = [];
const allBooks = []; // This will contain ALL books and eBooks data
const allAuthors = [];
const allCategories = [];
const allBooksAuthors = [];
const allBooksCategories = [];
const maxBooks = 50;
const maxEbooks = 50;

var modal = $('#booksModal');
var span = $('.close');
var user = JSON.parse(sessionStorage.getItem('user'));

$(document).ready(function () {

    if (!user) {
        $('#quizBtn').hide();
    }

    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('toggle-mode').checked = true; // Set checkbox to checked if dark mode
    } else if (currentTheme === 'light') {
        document.body.classList.remove('dark-mode');
        document.getElementById('toggle-mode').checked = false; // Set checkbox to unchecked if light mode
    }

    var userWelcome = document.getElementById("userWelcome");
    if (user) {
        userWelcome.innerText = `Welcome ${user.userName}!`;
    }
    else {
        userWelcome.innerText = "Welcome guest!";
    }

    var quizBtn = document.getElementById("quizBtn");
    quizBtn.addEventListener('click', event => {
        window.location.href = "quiz.html";
    });

    // --- Data Fetching Functions (API Calls using config) ---

    async function getBooksDisplayDataFromDB() {
        // FIXED: Use config.js
        await ajaxCall("GET", config.getEndpoint('booksDisplay'), "", getBooksDisplayDataFromDBSCB, getBooksDisplayDataFromDBECB);
    }

    function getBooksDisplayDataFromDBSCB(result) {
        allBooksDisplay.push(result);
        console.log(allBooksDisplay);
        renderAllBooksDisplay(result);
    }

    function getBooksDisplayDataFromDBECB(err) {
        console.log(err);
    }

    async function getEBooksDisplayDataFromDB() {
        // FIXED: Use config.js
        await ajaxCall("GET", config.getEndpoint('ebooksDisplay'), "", getEBooksDisplayDataFromDBSCB, getEBooksDisplayDataFromDBECB);
    }
    function getEBooksDisplayDataFromDBSCB(result) {
        allBooksDisplay.push(result);
        console.log(allBooksDisplay);
        renderAllEBooksDisplay(result);
    }
    function getEBooksDisplayDataFromDBECB(err) {
        console.log(err);
    }

    async function getAllBooksDataFromDB() {
        // FIXED: Use config.js
        await ajaxCall("GET", config.getEndpoint('allBooks'), "", getAllBooksDataFromDBSCB, getAllBooksDataFromDBECB);
    }

    function getAllBooksDataFromDBSCB(result) {
        allBooks.push(...result); // Spread to flatten the results into allBooks
    }

    function getAllBooksDataFromDBECB(err) {
        console.log(err);
    }

    async function getAllEBooksDataFromDB() {
        // FIXED: Use config.js
        await ajaxCall("GET", config.getEndpoint('allEBooks'), "", getAllEBooksDataFromDBSCB, getAllEBooksDataFromDBECB);
    }

    function getAllEBooksDataFromDBSCB(result) {
        allBooks.push(...result); // Spread to flatten the results into allBooks
        console.log("All books and ebooks combined:", allBooks);
    }

    function getAllEBooksDataFromDBECB(err) {
        console.log(err);
    }
    
    // --- Rendering Functions ---
    
    var carouselContainer = $('#books-container .carousel');

    function renderAllBooksDisplay(books) {
        // ... (Rendering logic remains the same) ...
        carouselContainer.empty();

        var row = $('<div id="carouselRow" class="carousel-row">');

        const itemsPerPage = 5; // Number of items to display at once
        const totalItems = books.length;

        const itemWidthPercentage = 100 / itemsPerPage;
        console.log(itemWidthPercentage);

        books.forEach(book => {
            var bookElement = $('<div class="carousel-item">').css('width', `${itemWidthPercentage}%`);
            bookElement.append('<img src="' + book.image + '" alt="book image" />');
            bookElement.append('<h3>' + book.title + '</h3>');
            bookElement.append('<p>' + 'By: ' + book.authorNames + '</p>');
            bookElement.append('<p>' + 'Price: ' + book.price + ' ILS' + '</p>');

            var addToWishlistBtn = $('<button class="wishlistButton" data-book-id="' + book.id + '">🤍</button>');
            bookElement.append(addToWishlistBtn);

            var addBookBtn = $('<button id="' + book.id + '" class="add-book">Buy Book</button>');
            bookElement.append(addBookBtn);

            var moreDetails = $('<p class="more-details">More Details</p>');
            bookElement.append(moreDetails);

            row.append(bookElement);

            addBookClick(addBookBtn);
            addWishlistClick(addToWishlistBtn);
            showMoreDetails(moreDetails, book);
        });

        carouselContainer.append(row);

        // Carousel functionality
        var currentIndex = 0;

        const rowWidthPercentage = totalItems * itemWidthPercentage;
        row.css('width', `${rowWidthPercentage}%`);

        function updateCarousel() {
            const offset = currentIndex * -itemWidthPercentage / (totalItems/itemsPerPage);
            console.log(offset);
            $('#carouselRow').css('transform', `translateX(${offset}%)`);
        }

        $('#carouselPrev').on('click', function () {
            if (currentIndex > 0) {
                currentIndex -= itemsPerPage;
                if (currentIndex < 0) currentIndex = 0;
                updateCarousel();
            }
        });

        $('#carouselNext').on('click', function () {
            if (currentIndex < totalItems - itemsPerPage) {
                currentIndex += itemsPerPage;
                if (currentIndex > totalItems - itemsPerPage) currentIndex = totalItems - itemsPerPage;
                updateCarousel();
            }
        });

        updateCarousel(); // Initial display
    }

    var eBookCarouselContainer = $('#ebooks-container .eBookCarousel');

    function renderAllEBooksDisplay(ebooks) {
        // ... (Rendering logic remains the same) ...
        eBookCarouselContainer.empty();

        var row = $('<div id="eBookCarouselRow" class="eBook-carousel-row">');

        const itemsPerPage = 5; // Number of items to display at once
        const totalItems = ebooks.length;

        const itemWidthPercentage = 100 / itemsPerPage;

        ebooks.forEach(ebook => {
            var ebookElement = $('<div class="eBookCarousel-item">').css('width', `${itemWidthPercentage}%`);
            ebookElement.append('<img src="' + ebook.image + '" alt="book image" />');
            ebookElement.append('<h3>' + ebook.title + '</h3>');
            ebookElement.append('<p>' + 'By: ' + ebook.authorNames + '</p>');
            ebookElement.append('<p>' + 'Price: ' + ebook.price + ' ILS' + '</p>');

            var addToWishlistBtn = $('<button class="wishlistButton" data-book-id="' + ebook.id + '">🤍</button>');
            ebookElement.append(addToWishlistBtn);

            var addBookBtn = $('<button id="' + ebook.id + '" class="add-book">Buy Book</button>');
            ebookElement.append(addBookBtn);

            var moreDetails = $('<p class="more-details">More Details</p>');
            ebookElement.append(moreDetails);

            row.append(ebookElement);

            addBookClick(addBookBtn);
            addWishlistClick(addToWishlistBtn);
            showMoreDetails(moreDetails, ebook);
        });

        eBookCarouselContainer.append(row);

        // Carousel functionality
        var currentIndex = 0;

        const rowWidthPercentage = totalItems * itemWidthPercentage;
        row.css('width', `${rowWidthPercentage}%`);

        function updateCarousel() {
            const offset = currentIndex * -itemWidthPercentage / (totalItems / itemsPerPage);
            $('#eBookCarouselRow').css('transform', `translateX(${offset}%)`);
        }

        $('#eBookCarouselPrev').on('click', function () {
            if (currentIndex > 0) {
                currentIndex -= itemsPerPage;
                if (currentIndex < 0) currentIndex = 0;
                updateCarousel();
            }
        });

        $('#eBookCarouselNext').on('click', function () {
            if (currentIndex < totalItems - itemsPerPage) {
                currentIndex += itemsPerPage;
                if (currentIndex > totalItems - itemsPerPage) currentIndex = totalItems - itemsPerPage;
                updateCarousel();
            }
        });

        updateCarousel(); // Initial display
    }

    function renderFilterdBooks(filterdBooks) {
        const mainContent = $('#main-content');
        mainContent.empty();
        mainContent.css({
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
        });


        console.log(filterdBooks);
        if (filterdBooks.length === 0) {
            var bookElement = $('<div>');
            bookElement.addClass('didnt-find');
            bookElement.append('<h2>' + 'We are sorry, we could not find any books that match your search.' + '<h2/>');
            bookElement.append('<h3>' + 'Please try again with a different search...' + '</h3>');
            mainContent.append(bookElement);
        }
        else {

            filterdBooks.forEach(function (book) {
                var bookElement = $('<div>');
                bookElement.addClass('book');
                bookElement.append('<img src="' + book.image + '" alt="book image" />');
                bookElement.append('<h3>' + book.title + '</h3>');
                bookElement.append('<p>' + 'By: ' + book.authorNames + '</p>');
                bookElement.append('<p>' + 'Price: ' + book.price + ' ILS' + '</p>');
                var addToWishlistBtn = $('<button class="wishlistButton" data-book-id="' + book.id + '">🤍</button>');
                bookElement.append(addToWishlistBtn);

                var addBookBtn = $('<button id="' + book.id + '" class="add-book">Add Book</button>');
                bookElement.append(addBookBtn);

                var moreDetails = $('<p class="more-details">More Details</p>');
                bookElement.append(moreDetails);

                mainContent.append(bookElement);

                addBookClick(addBookBtn);
                addWishlistClick(addToWishlistBtn);
                showMoreDetails(moreDetails, book);
            });
        }
    }


    // --- Wishlist and Purchase Functions ---

    function isLoggedIn() {
        return sessionStorage.getItem('user') !== null;
    }
    
    // REPLACED MOCK FUNCTION with an actual lookup against the consolidated 'allBooks' array
    function getBookById(bookId) {
        // Iterate through allBooks array to find the book
        const foundBook = allBooks.find(book => book.id == bookId); 
        
        if (!foundBook) {
            console.error("Book not found for ID:", bookId);
        }
        
        return foundBook;
    }
    
    //Function to add a book to the wishlist
    function addBookToWishlist(userId, bookId) {
        // FIXED: Use config.js for URL
        const api = config.addBookToWishlistUrl(userId); 
        const data = getBookById(bookId); 
        
        if (!data) {
            alert("Error: Could not retrieve book details.");
            return;
        }
        
        ajaxCall(
            'POST',
            api,
            JSON.stringify(data),
            function (response) {
                console.log("Success:", response);
                alert("Added to wishlist");
                $(`button[data-book-id="${bookId}"]`).addClass('filled').text('❤️'); 
            },
            function (error) {
                console.error("Error:", error);
                alert("Book was already added!");
            }
        );
    }

    // Function to handle wishlist button click
    function addWishlistClick(wishlistBtn) {
        wishlistBtn.on('click', function () {
            const bookId = $(this).data('book-id');
            const user = JSON.parse(sessionStorage.getItem('user')); 

            if (user && user.id && isLoggedIn()) {
                addBookToWishlist(user.id, bookId);
            } else {
                console.log("User not logged in. Redirecting to login.");
                alert("Please login or register to add book.");
                window.location.href = "login.html";
            }
        });
    }

    // Function to add a book to the purchased list
    function addBookToPurchased(userId, book) {
        // FIXED: Use config.js for URL
        const api = config.addBookToPurchasedUrl(userId);
        const data = JSON.stringify(book);

        console.log("API URL:", api);
        console.log("Request Data:", data);

        ajaxCall(
            'POST',
            api,
            data,
            function (response) {
                console.log("Success:", response);
                alert("The book added to purchased list");
            },
            function (error) {
                console.error("Error:", error);
                alert("You already added this book.");
            }
        );
    }

    // Event listener for add book button
    function addBookClick(addBookBtn) {
        addBookBtn.on('click', function (event) {
            if (event.target.tagName.toLowerCase() === 'button') {
                const buttonId = event.target.id;
                console.log("Button clicked with ID:", buttonId);

                if (isLoggedIn()) {
                    const user = JSON.parse(sessionStorage.getItem('user'));
                    // FIXED: Use the correct getBookById function
                    const book = getBookById(buttonId); 
                    
                    if (book) {
                        addBookToPurchased(user.id, book);
                    } else {
                        alert("Could not find book details. Purchase failed.");
                    }
                } else {
                    console.log("User not logged in. Redirecting to login.");
                    alert("Please login or register to add book.");
                    window.location.href = "login.html";
                }
            }
        });
    }

    // --- Top Books and Recommendations (API Calls using config) ---

    // Fetch the top 5 most purchased books
    async function getTop5MostPurchasedBooks() {
        // FIXED: Use config.js
        await ajaxCall("GET", config.getEndpoint('top5Books'), "", getTop5MostPurchasedBooksSCB, getTop5MostPurchasedBooksECB);
    }

    function getTop5MostPurchasedBooksSCB(result) {
        console.log("Top 5 Most Purchased Books:", result);
        renderTop5MostPurchasedBooks(result);
    }

    function getTop5MostPurchasedBooksECB(err) {
        console.error("Error fetching top 5 most purchased books:", err);
    }

    function renderTop5MostPurchasedBooks(books) {
        var topBooksContainer = $('#top-books-container');
        topBooksContainer.empty(); 

        if (books.length === 0) {
            topBooksContainer.append('<p>No top books available at the moment.</p>');
            return;
        }

        var table = $('<table>');
        var tableHeader = $('<tr>');

        books.forEach(book => {
            var bookElement = $('<td>');
            bookElement.append(`<img src="${book.smallThumbnail}" alt="book image" />`);
            bookElement.append('<h3>' + book.title + '</h3>');
            bookElement.append('<p>' + 'By: ' + book.authorName + '</p>');
            bookElement.append('<p>' + 'Price: ' + book.price + ' ILS' + '</p>');
            var addToWishlistBtn = $('<button class="wishlistButton" data-book-id="' + book.id + '">🤍</button>');
            bookElement.append(addToWishlistBtn);

            var addBookBtn = $('<button id="' + book.id + '" class="add-book">Buy Book</button>');
            bookElement.append(addBookBtn);

            var moreDetails = $('<p class="more-details">More Details</p>');
            bookElement.append(moreDetails);

            tableHeader.append(bookElement);

            addBookClick(addBookBtn);
            addWishlistClick(addToWishlistBtn); 
            showMoreDetails(moreDetails, book);

        });

        table.append(tableHeader);
        topBooksContainer.append(table);
    }

    //Fetch recommended books by top categories for the user
    async function getRecommendedBooksByCategory(userId) {
        // FIXED: Use config.js
        await ajaxCall("GET", config.getRecommendationsUrl(userId), "", getRecommendedBooksByCategorySCB, getRecommendedBooksByCategoryECB);
    }

    function getRecommendedBooksByCategorySCB(result) {
        console.log("Recommended Books:", result);
        renderRecommendedBooks(result);
    }

    function getRecommendedBooksByCategoryECB(err) {
        console.error("Error fetching recommended books:", err);
        alert("An error occurred while fetching recommended books.");
    }

    function renderRecommendedBooks(books) {
        var recommendedBooksContainer = $('#recommended-books-container');
        recommendedBooksContainer.empty(); 

        if (books.length === 0) {
            recommendedBooksContainer.append('<p>No recommended books available at the moment.</p>');
            return;
        }

        var table = $('<table>');
        var tableHeader = $('<tr>');
        console.log(books);
        books.forEach(book => {
            var bookElement = $('<td>');
            bookElement.append(`<img src="${book.smallThumbnail}" alt="book image" />`);
            bookElement.append('<h3>' + book.title + '</h3>');
            bookElement.append('<p>' + 'By: ' + book.authorName + '</p>');
            bookElement.append('<p>' + 'Price: ' + book.price + ' ILS' + '</p>');
            // Note: The API returns bookId for recommendations, ensure this works with the rest of your system
            var addToWishlistBtn = $('<button class="wishlistButton" data-book-id="' + book.bookId + '">🤍</button>');
            bookElement.append(addToWishlistBtn);

            var addBookBtn = $('<button id="' + book.bookId + '" class="add-book">Buy Book</button>');
            bookElement.append(addBookBtn);
            tableHeader.append(bookElement);
            addBookClick(addBookBtn);
            addWishlistClick(addToWishlistBtn);

        });

        table.append(tableHeader);
        recommendedBooksContainer.append(table);
    }

    if (user) {
        getRecommendedBooksByCategory(user.id);
    }
    
    // Call function to load top 5 most purchased books when document is ready
    getTop5MostPurchasedBooks();


    // --- Modal Functions ---

    modal.css('display', 'none');
    span.on('click', function () {
        modal.css('display', 'none');
    });

    $(window).on('click', function (event) {
        if (event.target === $('#booksModal')[0]) {
            $('#booksModal').hide();
        }
    });


    function showMoreDetails(moreDetails, book) {
        moreDetails.on('click', function () {
            modal.css('display', 'block');
            $('#modal-content').children().slice(1).remove();
            renderBooksModal(book);
        });
    }

    function renderBooksModal(book) {
        var modalContent = $('#modal-content');
        var bookModal = {};
        //search for the book in allBooks
        const foundBook = getBookById(book.id); // Use the updated helper
        
        if (foundBook) {
            bookModal = foundBook;
        } else {
             // Fallback to the display object if full details aren't loaded yet
             bookModal = book; 
             console.warn("Full book details not found in allBooks array for modal, using display data.");
        }
        
        console.log(book.id)    
        console.log(bookModal);
        var bookElement = $('<div>');
        bookElement.addClass('bookModal');
        bookElement.append('<img src="' + bookModal.image + '" alt="book image" />');
        bookElement.append('<h3>' + bookModal.title + '</h3>');
        bookElement.append('<h5>' + bookModal.subtitle + '</h5>');
        bookElement.append('<p>' + 'Publisher: ' + bookModal.publisher + '</p>');
        bookElement.append('<p>' + 'Published Date: ' + bookModal.publishedDate + '</p>');
        bookElement.append('<p>' + 'Language: ' + bookModal.language + '</p>');
        bookElement.append('<p>' + 'Page Count: ' + bookModal.pageCount + '</p>');
        bookElement.append('<p>' + 'Description: ' + bookModal.description + '</p>');
        bookElement.append('<p>' + 'By: ' + bookModal.authorNames + '</p>');
        bookElement.append('<p>' + 'Price: ' + bookModal.price + ' ILS' + '</p>');

        modalContent.append(bookElement);
    }


    // --- Search Functionality ---

    function searchBooks() {
        const query = $('#search-input').val();
        const filterdBooks = []  
        
        allBooks.forEach( function (book) {
            // check if the query is in the title of the book with no case sensitivity
            if (
                book.title.toLowerCase().includes(query.toLowerCase()) ||
                book.authorNames.toLowerCase().includes(query.toLowerCase()) ||
                book.description.toLowerCase().includes(query.toLowerCase())) 
            {
                filterdBooks.push(book);
            }
        });
        
        renderFilterdBooks(filterdBooks);
    }

    // --- Initial Data Load and Event Listeners ---

    getBooksDisplayDataFromDB();
    getEBooksDisplayDataFromDB();
    getAllBooksDataFromDB();
    getAllEBooksDataFromDB(); // This runs last and flattens all book data into allBooks array

    const searchBtn = document.getElementById("searchBtn");

    $(searchBtn).click(function () {
        searchBooks();

    });


    const allBooksBtn = document.getElementById("allBooksBtn");
    $(allBooksBtn).click(function () {
        window.location.href = "booksCatalog.html";
    });

    const allEBooksBtn = document.getElementById("allEBooksBtn");
    $(allEBooksBtn).click(function () {

        window.location.href = "ebooksCatalog.html";
    });

    const authorsBtn = document.getElementById("authorsBtn");
    $(authorsBtn).click(function () {
        window.location.href = "authors.html";
    });

    const loginBtn = document.getElementById("loginBtn");
    $(loginBtn).click(function () {
        window.location.href = "login.html";
    });

    const logoutbtn = document.getElementById("logoutBtn");

    $(logoutbtn).click(function () {
        sessionStorage.clear();
        window.location.reload();
    });


    const registerbtn = document.getElementById("registerBtn");

    $(registerbtn).click(function () {
        window.location.href = "register.html";
    });

    const adminbtn = document.getElementById("adminBtn");

    $(adminBtn).click(function () {
        window.location.href = "admin.html";
    });

    const myBooks = document.getElementById("myBooksBtn");
    $(myBooks).click(function () {
        window.location.href = "myBooks.html";

    });

    const wishlistBtn = document.getElementById("wishlistBtn");
    $(wishlistBtn).click(function () {
        window.location.href = "wishList.html";
    });

    const purchaseBooksBtn = document.getElementById("purchaseBooksBtn");
    $(purchaseBooksBtn).click(function () {
        window.location.href = "transferBook.html";
    });

    const mypurchaserequestsBtn = document.getElementById("mypurchaserequestsBtn");
    $(mypurchaserequestsBtn).click(function () {
        window.location.href = "purchaseRequests.html";
    });

    const additionsBtn = document.getElementById("additionsBtn");
    $(additionsBtn).click(function () {
        window.location.href = "additions.html";
    });


    // Check user status and display appropriate buttons
    if (user && !user.isAdmin) {
        $('#logoutBtn').show();
        $('#loginBtn').hide();
        $('#registerBtn').hide();
        $('#purchaseBooksBtn').show();
        $('#myBooksBtn').show();
        $('#adminBtn').hide();
        $('#wishlistBtn').show(); 
        $('#mypurchaserequestsBtn').show();
        $('#quizBtn').show();
        $('#recommendedBooksHeader').show(); // Ensure recommended books header is visible for logged-in users
        
    } else if (user && user.isAdmin) {
        $('#logoutBtn').show();
        $('#loginBtn').hide();
        $('#registerBtn').hide()
        $('#purchaseBooksBtn').hide();            ;
        $('#myBooksBtn').hide();
        $('#adminBtn').show();
        $('#wishlistBtn').hide(); 
        $('#mypurchaserequestsBtn').hide();
        $('#quizBtn').hide();
        $('#recommendedBooksHeader').hide();


    } else {
        $('#logoutBtn').hide();
        $('#loginBtn').show();
        $('#purchaseBooksBtn').hide();
        $('#registerBtn').show();
        $('#myBooksBtn').hide();
        $('#adminBtn').hide();
        $('#wishlistBtn').hide(); 
        $('#mypurchaserequestsBtn').hide();
        $('#quizBtn').hide();
        $('#recommendedBooksHeader').hide();

    }

    // Event listener to toggle the theme and save it in localStorage
    document.getElementById('toggle-mode').addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });

 
    // This is duplicate logic from the 'change' event above, consider removing this block
    const toggleButton = document.getElementById('toggle-mode');
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        let theme = 'light';
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark';
        }
        localStorage.setItem('theme', theme);
    });

});