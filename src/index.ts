import * as dotenv from 'dotenv';
import { ApolloServer, AuthenticationError } from 'apollo-server';
import typeDefs from './schema/schema';
import resolvers from './resolvers';
import prisma from './connection';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { authDirectiveTransformer } from './directives/authDirective';
dotenv.config();

let schema = makeExecutableSchema({ 
  typeDefs, 
  resolvers
});
schema = authDirectiveTransformer(schema, 'auth');

const server = new ApolloServer({
  // typeDefs,
  // resolvers,
  schema,
  context: async ({ req }) => {
    const context = { req, prisma };
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
