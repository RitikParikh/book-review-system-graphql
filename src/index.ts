import * as dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server';
import typeDefs from './schema/schema';
import resolvers from './resolvers';
import prisma from './connection';
dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    prisma,
  },
});

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
