import { IAddBook } from './book.interface';
import { addBookDto } from './book.dto';
import * as bookService from './book.service';
import { ApolloError } from 'apollo-server';
import * as yup from 'yup';
import { Context } from '../../middleware/interface';

/**
 * Controller function to add a new book.
 *
 * @param {any} _ - The parent resolver's result.
 * @param {IAddBook} data - The data to add a new book.
 * @param {Context} context - The context object containing request information.
 * @returns {Promise<any>} - The newly created book object.
 * @throws {ApolloError} - If validation fails or an error occurs during book creation.
 */
export const addBook = async (_: any, data: IAddBook, context: Context): Promise<any> => {
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

/**
 * Controller function to fetch all books.
 *
 * @param {any} _ - The parent resolver's result.
 * @param {{ query: { page?: number, rowsPerPage?: number, search?: string }}} data - Query parameters for pagination and search.
 * @returns {Promise<any>} - An array of books matching the query parameters.
 * @throws {ApolloError} - If an error occurs during fetching books.
 */
export const getBooks = async (_: any, data: { query: { page: number, rowsPerPage: number, search: string } })=> {
  try {
    return await bookService.fetchAllBook(data?.query);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};

/**
 * Controller function to fetch a book by ID.
 *
 * @param {any} _ - The parent resolver's result.
 * @param {{ id: number }} data - The ID of the book to fetch.
 * @returns {Promise<any>} - The book object matching the ID.
 * @throws {ApolloError} - If the book with the given ID is not found or an error occurs.
 */
export const getBook = async (_: any, data: { id: number }): Promise<any> => {
  try {
    let book = await bookService.fetchBookById(data?.id);
    if (!book) throw new ApolloError('Book not found');
    return book;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};
