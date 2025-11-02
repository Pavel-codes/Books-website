// config.js
const config = (() => {
  const hostname = window.location.hostname;
  
  let apiBaseUrl;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    apiBaseUrl = 'http://localhost:8080'; // Your local API port
  } else {
    apiBaseUrl = 'https://proj.ruppin.ac.il/cgroup85/test2/tar1';
  }
  
  return {
    apiBaseUrl,
    
    get apiUrl() {
      return `${this.apiBaseUrl}/api`;
    },
    
    // ============================================
    // ALL ENDPOINTS
    // ============================================
    endpoints: {
      // Api
      getApiKey: '/GetApiKey',
      
      // Authors
      authors: '/Authors',
      authorById: '/Authors', // use with /{id}
      authorBooks: '/Authors/GetBooksByAuthor', // use with {authorId}
      authorsInLibraries: '/Authors/getAuthorsNumberInLibraries',
      
      // Books
      booksDisplay: '/Books/GetBooksDisplay',
      eBooksDisplay: '/Books/GetEBooksDisplay',
      allBooks: '/Books/GetAllBooks',
      allEBooks: '/Books/GetAllEBooks',
      titlesAndAuthors: '/Books/GetTitlesAndAuthors',
      topFiveBooks: '/Books/GetTopFiveMostPurchasedBooks',
      allReadBooks: '/Books/GetAllReadBooks',
      postAllBooks: '/Books/PostAllBooks',
      postBooksByAuthor: '/Books/PostAllBooksAuthors', // use with /{authorId}
      postBooksByCategory: '/Books/PostAllBooksCategories', // use with /{categoryId}
      bookById: '/Books', // use with /{id}
      
      // Categories
      categories: '/Categories',
      categoryById: '/Categories', // use with /{id}
      recommendCategories: '/Categories/recommend', // use with /{userId}
      
      // Mails
      mails: '/Mails',
      
      // UserBooks
      userBooksGet: '/UserBooks/get',
      userBooksGetLibrary: '/UserBooks/getUserLibrary',
      userBooksInLibraries: '/UserBooks/getBooksNumInLibraries',
      userBooksAddToPurchased: '/UserBooks/addBookToPurchased', // use with /{userId}
      userBooksAddToWishlist: '/UserBooks/addBookToWishlist', // use with /{userId}
      userBooksUpdateStatus: '/UserBooks/update-status',
      userBooksAddPurchaseRequest: '/UserBooks/addBookPurchaseRequest',
      userBooksPurchaseRequests: '/UserBooks/getPurchaseRequestsForUser', // use with /{sellerId}
      userBooksUpdatePurchaseStatus: '/UserBooks/updatePurchaseRequestStatus',
      userBooksTransfer: '/UserBooks/Transfer-Book',
      userBooksCheckBook: '/UserBooks/checkBookInLibrary',
      
      // Users
      users: '/Users',
      userHighScore: '/Users/GetUserHighScore', // use with /{id}
      topHighScores: '/Users/GetTopHighScores',
      allUsers: '/Users/GetAllUsers',
      userLogin: '/Users/login',
      updateUserData: '/Users/UpdateUserData', // use with /{id}
      updateHighScore: '/Users/UpdateHighScore', // use with /{id}
      userById: '/Users', // use with /{id}
      userByEmail: '/Users/GetUserByEmail', // use with /{email}
      updateUserPassword: '/Users/UpdateUserPassword', // use with /{email}
    },
    
    // ============================================
    // BASIC HELPER METHODS
    // ============================================
    
    getEndpoint(endpoint) {
      return `${this.apiUrl}${this.endpoints[endpoint]}`;
    },
    
    buildUrl(path) {
      return `${this.apiUrl}${path}`;
    },
    
    // ============================================
    // API KEY
    // ============================================
    
    getApiKeyUrl() {
      return `${this.apiBaseUrl}${this.endpoints.getApiKey}`;
    },
    
    // ============================================
    // AUTHORS HELPERS
    // ============================================
    
    getAuthorByIdUrl(id) {
      return `${this.getEndpoint('authorById')}/${id}`;
    },
    
    getBooksByAuthorUrl(authorId) {
      return `${this.getEndpoint('authorBooks')}${authorId}`;
    },
    
    // ============================================
    // BOOKS HELPERS
    // ============================================
    
    getBookByIdUrl(id) {
      return `${this.getEndpoint('bookById')}/${id}`;
    },
    
    deleteBookUrl(id) {
      return `${this.getEndpoint('bookById')}/${id}`;
    },
    
    postBooksByAuthorUrl(authorId) {
      return `${this.getEndpoint('postBooksByAuthor')}/${authorId}`;
    },
    
    postBooksByCategoryUrl(categoryId) {
      return `${this.getEndpoint('postBooksByCategory')}/${categoryId}`;
    },
    
    // ============================================
    // CATEGORIES HELPERS
    // ============================================
    
    getCategoryByIdUrl(id) {
      return `${this.getEndpoint('categoryById')}/${id}`;
    },
    
    updateCategoryUrl(id) {
      return `${this.getEndpoint('categoryById')}/${id}`;
    },
    
    deleteCategoryUrl(id) {
      return `${this.getEndpoint('categoryById')}/${id}`;
    },
    
    getRecommendedCategoriesUrl(userId) {
      return `${this.getEndpoint('recommendCategories')}/${userId}`;
    },
    
    // ============================================
    // USERBOOKS HELPERS
    // ============================================
    
    getUserBooksUrl(userID, status) {
      return `${this.getEndpoint('userBooksGet')}?userID=${userID}&status=${status}`;
    },
    
    getUserLibraryUrl(userId) {
      return `${this.getEndpoint('userBooksGetLibrary')}?userId=${userId}`;
    },
    
    addBookToPurchasedUrl(userId) {
      return `${this.getEndpoint('userBooksAddToPurchased')}/${userId}`;
    },
    
    addBookToWishlistUrl(userId) {
      return `${this.getEndpoint('userBooksAddToWishlist')}/${userId}`;
    },
    
    updateBookStatusUrl(userID, bookID, newStatus) {
      return `${this.getEndpoint('userBooksUpdateStatus')}?userID=${userID}&bookID=${bookID}&newStatus=${newStatus}`;
    },
    
    getPurchaseRequestsUrl(sellerId) {
      return `${this.getEndpoint('userBooksPurchaseRequests')}/${sellerId}`;
    },

    checkBookInLibraryUrl(userId, bookId) {
      return `${this.getEndpoint('userBooksCheckBook')}?userId=${userId}&bookId=${bookId}`;
    },
    
    addBookPurchaseRequestUrl(buyerId, sellerId, bookId) {
      return `${this.getEndpoint('userBooksAddPurchaseRequest')}?buyerId=${buyerId}&sellerId=${sellerId}&bookId=${bookId}`;
    },

    // ============================================
    // USERS HELPERS
    // ============================================
    
    getUserHighScoreUrl(id) {
      return `${this.getEndpoint('userHighScore')}/${id}`;
    },
    
    updateUserDataUrl(id) {
      return `${this.getEndpoint('updateUserData')}/${id}`;
    },
    
    updateHighScoreUrl(id) {
      return `${this.getEndpoint('updateHighScore')}/${id}`;
    },
    
    deleteUserUrl(id) {
      return `${this.getEndpoint('userById')}/${id}`;
    },
    
    getUserByEmailUrl(email) {
      return `${this.getEndpoint('userByEmail')}/${email}`;
    },
    
    updateUserPasswordUrl(email) {
      return `${this.getEndpoint('updateUserPassword')}/${email}`;
    },
  };
})();

export default config;
