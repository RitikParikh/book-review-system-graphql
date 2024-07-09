// index.ts

// Importing necessary modules and configurations
import * as dotenv from 'dotenv'; // Load environment variables from a .env file
import { ApolloServer, AuthenticationError, UserInputError, ApolloError  } from 'apollo-server'; // Import Apollo Server and AuthenticationError for handling GraphQL server and authentication errors
import typeDefs from './schema/schema'; // Import GraphQL type definitions
import resolvers from './resolvers'; // Import GraphQL resolvers
import prisma from './connection'; // Import Prisma client for database connection
import { makeExecutableSchema } from '@graphql-tools/schema'; // Utility to make an executable GraphQL schema
import { authDirectiveTransformer } from './directives/authDirective'; // Import custom directive transformer for authentication

// Load environment variables
dotenv.config();

// Create an executable schema with type definitions and resolvers
let schema = makeExecutableSchema({ 
  typeDefs, 
  resolvers 
});

// Apply custom authentication directive to the schema
schema = authDirectiveTransformer(schema, 'auth');

// Initialize Apollo Server with the executable schema
const server = new ApolloServer({
  schema,
  // Set up context for each request, providing access to the request object and Prisma client
  context: async ({ req }) => {
    const context = { req, prisma };
    return context;
  },
  // Custom error formatting to handle AuthenticationError separately
  formatError: (error) => {
    if (error.originalError instanceof AuthenticationError) {
      return new AuthenticationError(error.message);
    }
    if (error.originalError instanceof UserInputError) {
      return new UserInputError(error.message);
    }
    // Default error handler
    return new ApolloError('Internal server error', 'INTERNAL_SERVER_ERROR');
  },
});

// Start the Apollo Server and listen on the specified port
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
