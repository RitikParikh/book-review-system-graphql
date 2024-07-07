// Import necessary modules and interfaces
import { AuthenticationError } from 'apollo-server'; 
import jwt from 'jsonwebtoken'; 
import { Context } from './interface';

// Secret key used for JWT token verification
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware function to authenticate requests
export const authMiddleware = async (context: Context) => {
  const authHeader = context.req.headers.authorization; 

  // Check if Authorization header is present
  if (authHeader) {
    // Split the Authorization header to extract the token (Bearer token)
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      try {
        // Verify the token using the JWT_SECRET
        const user = jwt.verify(token, JWT_SECRET);
        context.user = user; 
        context.token = token;
        return context; 
      } catch (error) {
        // Handle JWT verification errors (e.g., invalid or expired token)
        console.error('Invalid/Expired token:', error);
        throw new AuthenticationError('Invalid/Expired token');
      }
    } else {
      // Handle case where token is not provided after 'Bearer '
      console.error('Authentication token must be provided');
      throw new AuthenticationError('Authentication token must be provided'); 
    }
  } else {
    // Handle case where Authorization header is missing
    console.error('Authorization header must be provided');
    throw new AuthenticationError('Authorization header must be provided');
  }
};
