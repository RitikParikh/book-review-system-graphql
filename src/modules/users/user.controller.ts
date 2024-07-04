import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterUserArgs, UserLogin } from './user.interface';
import { registerUserDto, loginUserDto } from './user.dto';
import * as userService from './user.service';
import { ApolloError } from 'apollo-server';
import * as yup from 'yup';
import { User } from '@prisma/client';

const TOKEN_EXPIRATION = parseInt(process.env.TOKEN_EXPIRATION || "24");

export const registerUser = async (_: any, data: RegisterUserArgs) => {
  try {
    await registerUserDto.validate(data, { abortEarly: false });
    const userExist = await userService.findUserByEmailWithoutPassword(data.email);
    if (userExist) {
      throw new ApolloError('This email already exist');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await userService.createUser({ email: data.email, password: hashedPassword, username: data.username });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};


export const loginUser = async (_: any, data: UserLogin) => {
  try {
    await loginUserDto.validate(data, { abortEarly: false });
    const userDetails  = await validateUser(data);
    const accessToken = generateJWTToken(userDetails, TOKEN_EXPIRATION);
    return {accessToken, user:{id:userDetails.id}};
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};

//------------------------------------------ Private Functions-----------------------------------------------------//

/**
 * Validate the user deatily
 *
 * @async
 * @private
 * @param {UserLogin} userData - The user object.
 * @returns {Promise<User>} - User Object without password.
 * @auther Ritik Parikh <ritikparikh98@gmail.com
 */
async function validateUser(userData: UserLogin) {
  try {
    const userInfo = await userService.findUserByEmail(userData.email);
    if (!userInfo) {
      throw new ApolloError('Wrong User Credentials');
    }
    const match = await bcrypt.compare(userData.password, userInfo.password);
    if (!match) {
      throw new ApolloError('Wrong User Credentials');
    }
    const { password, ...userWithoutPass } = userInfo;
    return userWithoutPass;
  } catch (error) {
    throw error;
  }
}

/**
 * Generate a token for the user.
 *
 * @private
 * @param {Partial<User>} user - The user object.
 * @param {number} tokenExpirationTime - The expiration time for the token in hours.
 * @returns {Promise<string>} - The generated token.
 * @auther Ritik Parikh <ritikparikh98@gmail.com
 */
function generateJWTToken(user: Partial<User>, tokenExpirationTime: number): string {
  try {
    const token = jwt.sign({ user }, process.env.JWT_SECRET || "" , {
      expiresIn:  tokenExpirationTime * 60 * 60
    });
    return token;
  } catch (error) {
    throw error;
  }
}
