import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterUserArgs, UserLogin, UserWithoutPasswordSchmas } from './user.interface';
import { registerUserDto, loginUserDto } from './user.dto';
import * as userService from './user.service';
import { ApolloError } from 'apollo-server';
import * as yup from 'yup';
import { Context } from '../../middleware/interface';

const TOKEN_EXPIRATION = parseInt(process.env.TOKEN_EXPIRATION || "24");
const REFRESH_TOKEN_EXPIRATION = parseInt(process.env.REFRESH_TOKEN_EXPIRATION || "720");


export const register = async (_: any, data: RegisterUserArgs) => {
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


export const login = async (_: any, data: UserLogin) => {
  try {
    await loginUserDto.validate(data, { abortEarly: false });
    const userDetails  = await validateUser(data);
    const accessToken = generateAccessToken(userDetails);
    const refershToken = generateRefreshToken(userDetails);
    return {accessToken,refershToken, user:{id:userDetails.id}};
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};

export const createAccessToken = async (_: any,{}, context: Context) => {
  try {
    const userToken = await userService.findUserRefershToken(context.user.user.id, context.token || "");
    if (!userToken) {
      throw new ApolloError('You are not authorized to perform the operation');
    }
    const accessToken = await generateAccessToken(context.user.user);
    return {accessToken};
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
function generateJWTToken(user: UserWithoutPasswordSchmas, tokenExpirationTime: number): string {
  try {
    const token = jwt.sign({ user }, process.env.JWT_SECRET || "" , {
      expiresIn:  tokenExpirationTime * 60 * 60
    });
    return token;
  } catch (error) {
    throw error;
  }
}

  /**
   * Generate an access token for the user.
   *
   * @async
   * @public
   * @param {} user - The user object.
   * @returns {Promise<string>} - The generated access token.
   * @auther Ritik Parikh <ritikparikh98@gmail..com>
   */
  async function generateAccessToken(user : UserWithoutPasswordSchmas) {
    const accessToken = generateJWTToken(user, TOKEN_EXPIRATION);
    return accessToken;
}

  /**
   * Generate a refresh token for the user.
   *
   * @async
   * !Note : send a refresh token in the `header` field
   *
   * @param {Partial<SUser>} user - The user object.
   * @returns {Promise<string>} - The generated refresh token.
   * @auther Ritik Parikh <ritikparikh@appcin.com>
   * @note When we pass remenber me the refresh token time will be more from defasult time
  */
  function generateRefreshToken(user : UserWithoutPasswordSchmas) {
      const refreshToken = generateJWTToken(user, REFRESH_TOKEN_EXPIRATION);
      userService.saveUserRefreshToken(user.id, refreshToken);
      return refreshToken;
  }
