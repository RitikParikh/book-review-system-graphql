import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql, GraphQLSchema } from 'graphql';
import typeDefs from '../src/schema/schema';
import { addBook, getBooks, getBook } from '../src/modules/books/book.controller';
import * as bookService from '../src/modules/books/book.service';
import { Context } from '../src/middleware/interface';
import { PrismaClient } from '@prisma/client';
import { IncomingMessage } from 'http';

// Mock book data
const mockBook = {
  id: 1,
  title: 'Test Book',
  author: 'Test Author',
  publishedYear: '2021',
  createdAt: new Date(),
  updatedAt: new Date(),
  reviews: [
    {
      id: 1,
      userId: 1,
      bookId: 1,
      rating: 5,
      comment: 'Great book!',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

const resolvers = {
  Query: {
    getBooks,
    getBook,
  },
  Mutation: {
    addBook,
  },
};

describe('Book Resolvers', () => {
  let schema: GraphQLSchema;

  beforeAll(() => {
    schema = makeExecutableSchema({ typeDefs, resolvers });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addBook', () => {
    it('should add a new book successfully', async () => {
      jest.spyOn(bookService, 'createBook').mockResolvedValue(mockBook);

      const mutation = `
        mutation {
          addBook(title: "Test Book", author: "Test Author", publishedYear: "2021") {
            id
            title
            author
            publishedYear
          }
        }
      `;

      const context: Context = {
        req: {} as IncomingMessage, // Mock request object
        prisma: {} as PrismaClient, // Mock prisma object
        user: {
          user: { id: '1' },
        },
        token: 'testToken',
      };

      const result = await graphql({
        schema: schema as GraphQLSchema,
        source: mutation,
        contextValue: context,
      });

      expect(result.data?.addBook).toEqual({
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: '2021',
      });
    });

    it('should throw an error if book creation fails', async () => {
      jest.spyOn(bookService, 'createBook').mockRejectedValue(new Error('Failed to create book'));

      const mutation = `
        mutation {
          addBook(title: "Test Book", author: "Test Author", publishedYear: "2021") {
            id
            title
            author
            publishedYear
          }
        }
      `;

      const context: Context = {
        req: {} as IncomingMessage, // Mock request object
        prisma: {} as PrismaClient, // Mock prisma object
        user: {
          user: { id: '1' },
        },
        token: 'testToken',
      };

      const result = await graphql({
        schema: schema as GraphQLSchema,
        source: mutation,
        contextValue: context,
      });

      expect(result.errors?.[0].message).toBe('Failed to create book');
    });
  });

  describe('getBooks', () => {
    it('should fetch all books successfully', async () => {
      jest.spyOn(bookService, 'fetchAllBook').mockResolvedValue([mockBook]);

      const query = `
        query {
          getBooks {
            id
            title
            author
            publishedYear
          }
        }
      `;

      const result = await graphql({
        schema: schema as GraphQLSchema,
        source: query,
      });

      expect(result.data?.getBooks).toEqual([{
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: '2021',
      }]);
    });

    it('should return an empty array if no books are found', async () => {
      jest.spyOn(bookService, 'fetchAllBook').mockResolvedValue([]);

      const query = `
        query {
          getBooks {
            id
            title
            author
            publishedYear
          }
        }
      `;

      const result = await graphql({
        schema: schema as GraphQLSchema,
        source: query,
      });

      expect(result.data?.getBooks).toEqual([]);
    });
  });

  describe('getBook', () => {
    it('should fetch a book by ID successfully', async () => {
      jest.spyOn(bookService, 'fetchBookById').mockResolvedValue(mockBook);

      const query = `
        query {
          getBook(id: 1) {
            id
            title
            author
            publishedYear
          }
        }
      `;

      const result = await graphql({
        schema: schema as GraphQLSchema,
        source: query,
      });

      expect(result.data?.getBook).toEqual({
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: '2021'
      });
    });

    it('should throw an error if the book is not found', async () => {
      jest.spyOn(bookService, 'fetchBookById').mockResolvedValue(null);

      const query = `
        query {
          getBook(id: 1) {
            id
            title
            author
            publishedYear
          }
        }
      `;

      const result = await graphql({
        schema: schema as GraphQLSchema,
        source: query,
      });

      expect(result.errors?.[0].message).toBe('Book not found');
    });
  });
});
