import prisma from '../../connection';
import { Book } from '@prisma/client';
import { IAddBook } from './book.interface';

/**
 * Create a new book in the database.
 *
 * @param {IAddBook} data - The data to create a new book.
 * @returns {Promise<Book>} - The newly created book object.
 * @throws {Error} - Any database error encountered during book creation.
 */
export const createBook = async (data: IAddBook): Promise<Book> => {
    try {
        return await prisma.book.create({ data });
    } catch (error) {
        console.error("Book Service createBook function",error);
        throw error;
    }
};

/**
 * Fetch all books from the database based on query parameters.
 *
 * @param {{ page: number | undefined, rowsPerPage: number | undefined, search: string | undefined }} query - Query parameters for pagination and search.
 * @returns {Promise<Book[]>} - An array of books matching the query parameters.
 * @throws {Error} - Any database error encountered during the operation.
 */
export const fetchAllBook = async (query: { page: number | undefined, rowsPerPage: number | undefined, search: string | undefined }): Promise<Book[]> => {
    try {
        const where: any = {};
        if (query?.search) {
            where['OR'] = [
                { title: { contains: query?.search } },
                { author: { contains: query?.search } },
            ];
        }
        const rowsPerPage = Number(query.rowsPerPage) || 0, page = query.page || 0;
        const limit: number = (rowsPerPage != 0) ? rowsPerPage : 0;

        return await prisma.book.findMany({
            include: {
                reviews: true,
            },
            take: limit,
            skip: page * rowsPerPage,
            where,
        });
    } catch (error) {
        console.error("Book Service fetchAllBook function",error);
        throw error;
    }
};

/**
 * Fetch a book by its ID from the database.
 *
 * @param {number} bookId - The ID of the book to fetch.
 * @returns {Promise<Book | null>} - The book object matching the ID, or null if not found.
 * @throws {Error} - Any database error encountered during the operation.
 */
export const fetchBookById = async (bookId: number): Promise<Book | null> => {
    try {
        return await prisma.book.findUnique({
            where: { id: bookId },
            include: {
                reviews: true,
            }
        });
    } catch (error) {
        console.error("Book Service fetchBookById function",error);
        throw error;
    }
};
