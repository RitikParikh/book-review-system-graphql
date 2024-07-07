import prisma from '../../connection';
import { User } from '@prisma/client';
import { RegisterUserArgs } from './user.interface';

/**
 * Create a new user in the database.
 *
 * @param {RegisterUserArgs} data - User registration data.
 * @returns {Promise<User>} - The newly created user object.
 * @throws {Error} - Any database error encountered during user creation.
 */
export const createUser = async (data: RegisterUserArgs): Promise<User> => {
    try {
        const newUser = await prisma.user.create({ data });
        return newUser;
    } catch (error) {
        throw error;
    }
};

/**
 * Find a user by their email address.
 *
 * @param {string} email - The email address of the user to find.
 * @returns {Promise<User | null>} - The user object if found, or null if not found.
 * @throws {Error} - Any database error encountered during the operation.
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
    try {
        return await prisma.user.findUnique({ where: { email } });
    } catch (error) {
        throw error;
    }
};

/**
 * Find a user by their email address, omitting the password field.
 *
 * @param {string} email - The email address of the user to find.
 * @returns The user object without the password field if found, or null if not found.
 * @throws {Error} - Any database error encountered during the operation.
 */
export const findUserByEmailWithoutPassword = async (email: string) => {
    try {
        return await prisma.user.findUnique({ omit: { password: true }, where: { email } });
    } catch (error) {
        throw error;
    }
};

/**
 * Save a user's refresh token in the database.
 *
 * @param {number} userId - The ID of the user.
 * @param {string} refreshToken - The refresh token to save.
 * @returns {Promise<void>} - A promise indicating the completion of the operation.
 * @throws {Error} - Any database error encountered during the operation.
 * @auther Ritik Parikh <ritikparikh98@gamil.com>
 */
export const saveUserRefreshToken = async (userId: number, refreshToken: string): Promise<void> => {
    try {
        await prisma.userToken.create({ data: { userId, refreshToken } });
    } catch (error) {
        throw error;
    }
};

/**
 * Find a user's refresh token by user ID and refresh token value.
 *
 * @param {number} userId - The ID of the user.
 * @param {string} refreshToken - The refresh token to find.
 * @returns - The user token object if found, or null if not found.
 * @throws {Error} - Any database error encountered during the operation.
 * @auther Ritik Parikh <ritikparikh98@gmail.com>
 */
export const findUserRefershToken = async (userId: number, refreshToken: string)=> {
    return await prisma.userToken.findFirst({
        where: { refreshToken, userId: userId }
    });
};
