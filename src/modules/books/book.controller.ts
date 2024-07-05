import { IAddBook } from './book.interface';
import { addBookDto } from './book.dto';
import * as bookService from './book.service';
import { ApolloError } from 'apollo-server';
import * as yup from 'yup';
import { Context } from '../../middleware/interface';


export const addBook = async (_: any, data: IAddBook,context : Context) => {
  try {
    await addBookDto.validate(data, { abortEarly: false });
    return await bookService.createBook(data);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};

export const getBooks = async (_: any) => {
  try {
    return await bookService.fetchAllBook();
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};

export const getBook = async (_: any, data: {id: number}) => {
  try {
    return await bookService.fetchBookById(data?.id);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};