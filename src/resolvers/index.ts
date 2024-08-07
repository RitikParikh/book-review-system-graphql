// Importing individual resolver functions from controllers
import { login, register, createAccessToken } from "../modules/users/user.controller";
import { addBook, getBook, getBooks } from "../modules/books/book.controller";
import { addReview, getMyReviews, getReviews, updateReview, deleteReview } from "../modules/reviews/review.controller";

// Define resolvers for GraphQL queries and mutations

const resolvers  = {
  Query: {
    healthCheck: () => 'Server is up and running!',
    getBook, 
    getBooks,
    getMyReviews,
    getReviews
  },
  Mutation: {
    register,
    login,
    createAccessToken,
    addBook,
    addReview,
    updateReview,
    deleteReview
  },
  User: {
  
  },
  Book: {
    
  },
  Review: {

  },
};

export default resolvers;
