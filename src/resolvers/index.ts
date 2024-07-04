import * as userResolver from "../modules/users/user.controller";

const resolvers = {
  Query: {
    healthCheck: () => 'Server is up and running!',
  },
  Mutation: {
    ...userResolver
  },
  User: {
  
  },
  Book: {
    
  },
  Review: {

  },
};

export default resolvers;
