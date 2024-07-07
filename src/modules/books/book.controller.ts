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

export const getBooks = async (_: any,data : { query  :{ page : number | undefined, rowsPerPage : number | undefined, search : string | undefined }}) => {
  try {
    return await bookService.fetchAllBook(data?.query);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};

export const getBook = async (_: any, data: {id: number}) => {
  try {
    let book =  await bookService.fetchBookById(data?.id);
    if(!book) throw new ApolloError('Book not found');
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};