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

export const fetchAllBook = async (query : { page : number | undefined, rowsPerPage : number | undefined, search : string | undefined }) : Promise<Book[]> => {
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
        skip:  page * rowsPerPage,
        where,
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