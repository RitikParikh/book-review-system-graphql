// Importing necessary modules and configurations
import * as dotenv from 'dotenv'; // Load environment variables from a .env file
import { ApolloServer, AuthenticationError, UserInputError, ApolloError } from 'apollo-server'; // Import Apollo Server and error types
import typeDefs from './schema/schema'; // Import GraphQL type definitions
import resolvers from './resolvers'; // Import GraphQL resolvers
import prisma from './connection'; // Import Prisma client for database connection
import { makeExecutableSchema } from '@graphql-tools/schema'; // Utility to make an executable GraphQL schema
import { authDirectiveTransformer } from './directives/authDirective'; // Import custom directive transformer for authentication
import winston from 'winston'; // Import winston for logging
import { GraphQLError } from 'graphql';

// Load environment variables
dotenv.config();

// Configure winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

/**
 * Format and log errors.
 * @param {ApolloError} error - The error object.
 * @returns {ApolloError} The formatted error object.
 */
const formatError = (error: GraphQLError) => {
  logger.error(error);

  if (error.originalError instanceof AuthenticationError) {
    return new AuthenticationError(error.message);
  }
  if (error.originalError instanceof UserInputError) {
    return new UserInputError(error.message);
  }
  // Default error handler
  return new ApolloError('Internal server error', 'INTERNAL_SERVER_ERROR');
};

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
  /**
   * Set up context for each request.
   * @param {Object} param0 - The request object.
   * @returns {Object} The context object.
   */
  context: async ({ req }) => {
    const context = { req, prisma };
    return context;
  },
  // Custom error formatting to handle different error types
  formatError: formatError,
});

// Start the Apollo Server and listen on the specified port
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`);
  console.log(`🚀 Server ready at ${url}`);
});
