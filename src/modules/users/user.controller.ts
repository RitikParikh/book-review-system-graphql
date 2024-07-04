import bcrypt from 'bcryptjs';
import { RegisterUserArgs } from './user.interface';
import { User } from '@prisma/client';
import * as userService from './user.service';
import { registerUserDto } from './user.dto';
import { ApolloError } from 'apollo-server';
import * as yup from 'yup';


export const registerUser = async (_: any, data: RegisterUserArgs) => {
  try {
    await registerUserDto.validate(data, { abortEarly: false });
    const userExist = await userService.findUserByEmail(data.email);
    if (userExist) {
      throw new ApolloError('This email already exist');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await  userService.createUser({email : data.email, password  :hashedPassword, username : data.username});
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};
