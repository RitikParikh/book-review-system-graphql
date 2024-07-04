import { AuthenticationError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import { Context } from './interface'; 


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const authMiddleware = async (context: Context) => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];

    if (token) {
      try {
        const user = jwt.verify(token, JWT_SECRET);
        context.user = user; // Attach user information to context
      } catch (error) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    } else {
      throw new AuthenticationError('Authentication token must be provided');
    }
  } else {
    throw new AuthenticationError('Authorization header must be provided');
  }
};
