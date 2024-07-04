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