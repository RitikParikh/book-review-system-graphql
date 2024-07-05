import prisma from '../../connection';
import { User } from '@prisma/client';
import { RegisterUserArgs } from './user.interface';

export const createUser = async (data : RegisterUserArgs) : Promise<User> => {
    try {
        const newUser = await prisma.user.create({ data });
        return newUser;
    } catch (error) {
        throw error;
    }
};

export const findUserByEmail = async (email : string) => {
    try {
        return await prisma.user.findUnique({ where:  {email}, });
    } catch (error) {
        throw error;
    }
};

export const findUserByEmailWithoutPassword = async (email : string) => {
    try {
        return await prisma.user.findUnique({ omit: { password: true}, where:  {email}, });
    } catch (error) {
        throw error;
    }
};

/**
 * Save a user's refresh token in the database.
 *
 * @param {string} userId - The user ID.
 * @param {string} refreshToken - The refresh token value.
 * @returns {void}
 * @auther Ritik Parikh <ritikparikh98@gamil.com
 * 
 */
export const saveUserRefreshToken = async(userId: number, refreshToken: string): Promise<void> => {
    try {
        await prisma.userToken.create({ data : { userId, refreshToken } });
    } catch (error) {
        throw error;
    }
}

/**
 * Find a user's refresh token by ID and refresh token value.
 *
 * @async
 * @param {string} id - The user ID.
 * @param {string} refreshToken - The refresh token value.
 * @returns {Promise<UserToken>} - The user token record that matches the ID and refresh token.
 * @auther Ritik Parikh <ritikparikh98@gmail.com
 */
export const  findUserRefershToken = async (userId: number, refreshToken: string) => {
    return await prisma.userToken.findFirst({
        where: { refreshToken, userId : userId}
    });
}