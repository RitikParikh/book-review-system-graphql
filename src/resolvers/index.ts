import {login,register} from "../modules/users/user.controller";

const resolvers = {
  Query: {
    healthCheck: () => 'Server is up and running!',
  },
  Mutation: {
    register,
    login
  },
  User: {
  
  },
  Book: {
    
  },
  Review: {

  },
};

export default resolvers;
