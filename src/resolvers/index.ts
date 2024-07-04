import {loginUser, registerUser} from "../modules/users/user.controller";

const resolvers = {
  Query: {
    healthCheck: () => 'Server is up and running!',
  },
  Mutation: {
    registerUser,
    loginUser
  },
  User: {
  
  },
  Book: {
    
  },
  Review: {

  },
};

export default resolvers;
