import * as dotenv from 'dotenv';
import { ApolloServer, AuthenticationError } from 'apollo-server';
import typeDefs from './schema/schema';
import resolvers from './resolvers';
import prisma from './connection';
import { authMiddleware } from './middleware/authMiddleware';
dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const context = { req, prisma }; 
    // await authMiddleware(context);
    return context;
  },
  formatError: (error) => {
    if (error.originalError instanceof AuthenticationError) {
      return new AuthenticationError(error.message);
    }
    return error;
  },
});

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
