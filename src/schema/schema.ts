// Import gql function from Apollo Server for defining GraphQL schema
import { gql } from 'apollo-server';

// Define GraphQL type definitions using gql template literal
const typeDefs = gql`
  directive @auth on FIELD_DEFINITION  

  type Query {
    healthCheck: String  
    getBooks(query : PaginationQuery): [Book]
    getBook(id: Int!): Book  
    getReviews(bookId: Int!, query : GetReviewsPaginationQuery): [Review]
    getMyReviews: [MyReview] @auth
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): UserWithoutPassword
    login(email: String!, password: String!): AuthPayload
    createAccessToken: AccessTokenPayload @auth
    addBook(title: String!, author: String!, publishedYear: String!): Book @auth
    addReview(bookId: Int!, rating: Int!, comment: String!): Review @auth
    updateReview(reviewId: Int!, rating: Int!, comment: String!): Review @auth
    deleteReview(reviewId: Int!): Review @auth
  }

  type User {
    id: ID!
    email: String!
    username: String
    password: String
    createdAt: String
    updatedAt: String
    reviews: [Review!]
  }

  type UserWithoutPassword {
    id: ID!
    email: String!
    username: String
    createdAt: String
    updatedAt: String
    reviews: [Review!]
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    publishedYear: String
    createdAt: String
    updatedAt: String
  }

  type Review {
    id: ID!
    userId: Int
    bookId: Int
    rating: Int
    comment: String
    createdAt: String
    updatedAt: String
  }

  type MyReview {
    id: ID!
    userId: Int
    bookId: Int
    rating: Int
    comment: String
    createdAt: String
    updatedAt: String
    book: Book!
  }

  type UserToken {
    id: ID!
    userId: Int
    refreshToken: String
    createdAt: String
    updatedAt: String
    user: User!
  }

  type AuthPayload {
    accessToken: String!
    refershToken: String!
  }

  type AccessTokenPayload {
    accessToken: String!
  }

  input PaginationQuery {
    page: Int
    rowsPerPage: Int
    search: String
  }

  input GetReviewsPaginationQuery {
    page: Int
    rowsPerPage: Int
  }
`;

export default typeDefs;
