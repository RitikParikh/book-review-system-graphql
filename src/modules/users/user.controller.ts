// Import necessary modules and functions
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterUserArgs, UserLogin, UserWithoutPasswordSchmas } from './user.interface';
import { registerUserDto, loginUserDto } from './user.dto';
import * as userService from './user.service';
import { ApolloError } from 'apollo-server';
import * as yup from 'yup';
import { Context } from '../../middleware/interface';

// Read token expiration times from environment variables or use default values
const TOKEN_EXPIRATION = parseInt(process.env.TOKEN_EXPIRATION || "24"); // Default: 24 hours
const REFRESH_TOKEN_EXPIRATION = parseInt(process.env.REFRESH_TOKEN_EXPIRATION || "720"); // Default: 720 hours (30 days)

/**
 * Handles user registration.
 *
 * @param _ - The parent object (not used in this case).
 * @param data - Registration data containing username, email, and password.
 * @returns {Promise<UserWithoutPasswordSchmas>} - User object without password.
 * @throws {ApolloError} If registration data validation fails or if the email is already in use.
 */
export const register = async (_: any, data: RegisterUserArgs): Promise<UserWithoutPasswordSchmas> => {
  try {
    await registerUserDto.validate(data, { abortEarly: false });

    // Check if user already exists with the provided email
    const userExist = await userService.findUserByEmailWithoutPassword(data.email);
    if (userExist) {
      throw new ApolloError('This email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await userService.createUser({
      email: data.email,
      password: hashedPassword,
      username: data.username
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    console.error("User controller register function",error);
    throw error;
  }
};

/**
 * Handles user login.
 *
 * @param _ - The parent object (not used in this case).
 * @param data - Login data containing email and password.
 * @returns {Promise<{ accessToken: string, refreshToken: string}>} - Object containing tokens and user ID.
 * @throws {ApolloError} If login data validation fails or if the credentials are incorrect.
 */
export const login = async (_: any, data: UserLogin) => {
  try {
    await loginUserDto.validate(data, { abortEarly: false });

    // Validate user credentials (email and password)
    const userDetails = await validateUser(data);

    // Generate JWT tokens (access token and refresh token)
    const accessToken = generateAccessToken(userDetails);
    const refreshToken = await generateRefreshToken(userDetails);
    // Return tokens and basic user information
    return { accessToken, refreshToken };
  } catch (error) {
    // Handle validation errors or authentication errors
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    console.error("User controller login function",error);
    throw error;
  }
};

/**
 * Generates a new access token for the user.
 *
 * @param _ - The parent object (not used in this case).
 * @param {} - Arguments (not used in this case).
 * @param context - Context object containing user information and token.
 * @returns {Promise<{ accessToken: string }>} - Object containing the new access token.
 * @throws {ApolloError} If user is not authorized to perform the operation.
 */
export const createAccessToken = async (_: any, {}, context: Context): Promise<{ accessToken: string }> => {
  try {
    // Find the user's refresh token from the database using user ID and token
    const userToken = await userService.findUserRefreshToken(context.user.user.id, context.token || "");

    // If no valid refresh token found, throw an error
    if (!userToken) {
      throw new ApolloError('You are not authorized to perform this operation');
    }

    // Generate a new access token for the user
    const accessToken = await generateAccessToken(context.user.user);
    return { accessToken };
  } catch (error) {
    // Handle validation errors or database errors
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    console.error("User controller createAccessToken function",error);
    throw error;
  }
};

//------------------------------------------ Private Functions-----------------------------------------------------//

/**
 * Validates user credentials (email and password).
 *
 * @async
 * @private
 * @param userData - User login credentials (email and password).
 * @returns {Promise<UserWithoutPasswordSchmas>} - User information without password.
 * @throws {ApolloError} If user credentials are incorrect.
 */
async function validateUser(userData: UserLogin): Promise<UserWithoutPasswordSchmas> {
  try {
    // Find user information from the database using email
    const userInfo = await userService.findUserByEmail(userData.email);

    // If no user found with the given email, throw an error
    if (!userInfo) {
      throw new ApolloError('Wrong User Credentials');
    }

    // Compare hashed password from the database with the provided password
    const match = await bcrypt.compare(userData.password, userInfo.password);

    // If passwords do not match, throw an error
    if (!match) {
      throw new ApolloError('Wrong User Credentials');
    }

    // Extract user information without password field
    const { password, ...userWithoutPass } = userInfo;
    return userWithoutPass;
  } catch (error) {
    console.error("User controller validateUser function",error);
    throw error;
  }
}

/**
 * Generates a JWT token for the user.
 *
 * @private
 * @param user - User information without password.
 * @param tokenExpirationTime - Expiration time for the token in hours.
 * @returns {string} - Generated JWT token.
 */
function generateAccessToken(user: UserWithoutPasswordSchmas): string {
  try {
    return generateJWTToken(user, TOKEN_EXPIRATION);
  } catch (error) {
    console.error("User controller generateAccessToken function",error);
    throw error;
  }
}

/**
 * Generates a refresh token for the user and saves it in the database.
 *
 * @private
 * @param user - User information without password.
 * @returns {string} - Generated refresh token.
 */
async function generateRefreshToken(user: UserWithoutPasswordSchmas): Promise<string> {
  try {
    const refreshToken = generateJWTToken(user, REFRESH_TOKEN_EXPIRATION);
    await userService.saveUserRefreshToken(user.id, refreshToken); // Save refresh token in the database
    return refreshToken;
  } catch (error) {
    console.error("User controller generateRefreshToken function",error);
    throw error;
  }
}

/**
 * Generates a JWT token for the user with specified expiration time.
 *
 * @private
 * @param user - User information without password.
 * @param tokenExpirationTime - Expiration time for the token in hours.
 * @returns {string} - Generated JWT token.
 */
function generateJWTToken(user: UserWithoutPasswordSchmas, tokenExpirationTime: number): string {
  try {
    // Generate JWT token using user information and JWT_SECRET from environment variables
    const token = jwt.sign({ user }, process.env.JWT_SECRET || "", {
      expiresIn: tokenExpirationTime * 60 * 60 // Convert hours to seconds for expiresIn option
    });
    return token;
  } catch (error) {
    console.error("User controller generateJWTToken function",error);
    throw error;
  }
}
