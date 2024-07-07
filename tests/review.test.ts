import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql, GraphQLSchema } from 'graphql';
import typeDefs from '../src/schema/schema';
import {
  addReview,
  getReviews,
  getMyReviews,
  updateReview,
  deleteReview,
} from '../src/modules/reviews/review.controller';
import * as reviewService from '../src/modules/reviews/review.service';
import { Context } from '../src/middleware/interface';
import { PrismaClient } from '@prisma/client';
import { IncomingMessage } from 'http';

// Mock review data
const mockReview = {
  id: 1,
  userId: 1,
  bookId: 1,
  rating: 5,
  comment: 'Great book!',
  createdAt: new Date(),
  updatedAt: new Date(),
  book: {
    id: 1,
    title: 'Test Book',
    author: 'Test Author',
    publishedYear: '2021',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

const resolvers = {
  Query: {
    getReviews,
    getMyReviews,
  },
  Mutation: {
    addReview,
    updateReview,
    deleteReview,
  },
};

describe('Review Resolvers', () => {
  let schema: GraphQLSchema;

  beforeAll(() => {
    schema = makeExecutableSchema({ typeDefs, resolvers });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addReview', () => {
    it('should add a new review successfully', async () => {
      jest.spyOn(reviewService, 'createReview').mockResolvedValue(mockReview);

      const mutation = `
        mutation {
          addReview(bookId: 1, rating: 5, comment: "Great book!") {
            id
            userId
            bookId
            rating
            comment
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

      expect(result.data?.addReview).toEqual({
        id: '1',
        userId: 1,
        bookId: 1,
        rating: 5,
        comment: 'Great book!',
      });
    });


  });

  describe('getReviews', () => {
    it('should fetch all reviews for a book successfully', async () => {
      jest.spyOn(reviewService, 'fetchBookReviews').mockResolvedValue([mockReview]);

      const query = `
        query {
          getReviews(bookId: 1) {
            id
            userId
            bookId
            rating
            comment
          }
        }
      `;

      const result = await graphql({
        schema: schema as GraphQLSchema,
        source: query,
      });

      expect(result.data?.getReviews).toEqual([{
        id: '1',
        userId: 1,
        bookId: 1,
        rating: 5,
        comment: 'Great book!'
      }]);
    });

  });

  describe('getMyReviews', () => {
    it('should fetch reviews written by the authenticated user successfully', async () => {
      jest.spyOn(reviewService, 'fetchMyReviews').mockResolvedValue([mockReview]);

      const query = `
        query {
          getMyReviews {
            id
            userId
            bookId
            rating
            comment
            book {
              id
              title
              author
              publishedYear
            }
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
        source: query,
        contextValue: context,
      });

      expect(result.data?.getMyReviews).toEqual([{
        id: '1',
        userId: 1,
        bookId: 1,
        rating: 5,
        comment: 'Great book!',
        book: {
          id: '1',
          title: 'Test Book',
          author: 'Test Author',
          publishedYear: '2021',
        },
      }]);
    });

  });

});
