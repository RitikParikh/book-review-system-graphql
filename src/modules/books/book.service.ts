import prisma from '../../connection';
import { Book } from '@prisma/client';
import { IAddBook } from './book.interface';

export const createBook = async (data : IAddBook) : Promise<Book> => {
    try {
        return await prisma.book.create({ data });
    } catch (error) {
        throw error;
    }
};

export const fetchAllBook = async () : Promise<Book[]> => {
    try {
        return await prisma.book.findMany({
            include: {
              reviews: true,
            },
          });
    } catch (error) {
        throw error;
    }
};

export const fetchBookById = async (bookId: number) => {
    try {
        return await prisma.book.findUnique({ where :{id : bookId},
            include: {
                reviews: true,
              }
        });
    } catch (error) {
        throw error;
    }
};