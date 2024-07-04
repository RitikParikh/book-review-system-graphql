import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    healthCheck: () => 'Server is up and running!',
    // Add other query resolvers as needed
  },
//   Mutation: {
   
//   },
  User: {
  
  },
  Book: {
    
  },
  Review: {

  },
};

export default resolvers;
