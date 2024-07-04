import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    healthCheck: String
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

  type Book {
    id: ID!
    title: String!
    author: String!
    publishedYear: String
    createdAt: String
    updatedAt: String
    reviews: [Review!]
  }

  type Review {
    id: ID!
    userId: Int
    bookId: Int
    rating: Int
    comment: String
    createdAt: String
    updatedAt: String
    user: User!
    book: Book!
  }
`;

export default typeDefs;
