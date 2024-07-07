import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql, GraphQLSchema } from 'graphql';
import typeDefs from '../src/schema/schema';
import { register, login, createAccessToken } from '../src/modules/users/user.controller';
import * as userService from '../src/modules/users/user.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Context } from '../src/middleware/interface';
import { PrismaClient } from '@prisma/client';
import { IncomingMessage } from 'http';

// Mock user data
const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedpassword',
  username: 'testuser',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const resolvers = {
  Mutation: {
    register,
    login,
    createAccessToken,
  },
};

describe('User Resolvers', () => {
  let schema: GraphQLSchema;

  beforeAll(() => {
    schema = makeExecutableSchema({ typeDefs, resolvers });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      jest.spyOn(userService, 'findUserByEmailWithoutPassword').mockResolvedValue(null);
      jest.spyOn(userService, 'createUser').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashedpassword');

      const mutation = `
        mutation {
          register(email: "test@example.com", password: "password123", username: "testuser") {
            id
            email
            username
          }
        }
      `;

      const result = await graphql({
        schema: schema as GraphQLSchema,
        source: mutation,
      });

      expect(result.data?.register).toEqual({
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
      });
    });

    it('should throw an error if email already exists', async () => {
      jest.spyOn(userService, 'findUserByEmailWithoutPassword').mockResolvedValue(mockUser);

      const mutation = `
        mutation {
          register(email: "test@example.com", password: "password123", username: "testuser") {
            id
            email
            username
          }
        }
      `;

      const result = await graphql({
        schema: schema as GraphQLSchema,
        source: mutation,
      });

      expect(result.errors?.[0].message).toBe('This email already exist');
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never); // Add 'as never' to satisfy TypeScript
      jest.spyOn(jwt, 'sign').mockImplementation(() => 'testToken');

      const mutation = `
        mutation {
          login(email: "test@example.com", password: "password123") {
            accessToken
            refershToken
          }
        }
      `;

      const result = await graphql({
        schema: schema as GraphQLSchema,
        source: mutation,
      });

      expect(result.data?.login).toEqual({
        accessToken: 'testToken',
        refershToken: 'testToken',
      });
    });

    it('should throw an error for incorrect credentials', async () => {
      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never); // Add 'as never' to satisfy TypeScript

      const mutation = `
        mutation {
          login(email: "test@example.com", password: "wrongpassword") {
            accessToken
            refershToken
          }
        }
      `;

      const result = await graphql({
        schema: schema as GraphQLSchema,
        source: mutation,
      });

      expect(result.errors?.[0].message).toBe('Wrong User Credentials');
    });
  });

  describe('createAccessToken', () => {
    it('should create a new access token successfully', async () => {
        let mockFindUserRefershToken = {
            id: 1,
            userId: 1,
            refreshToken: 'hashedpassword',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
      jest.spyOn(userService, 'findUserRefershToken').mockResolvedValue(mockFindUserRefershToken);
      jest.spyOn(jwt, 'sign').mockImplementation(() => 'newAccessToken');

      const mutation = `
        mutation {
          createAccessToken {
            accessToken
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

      expect(result.data?.createAccessToken).toEqual({
        accessToken: 'newAccessToken',
      });
    });

    it('should throw an error for missing refresh token', async () => {
      jest.spyOn(userService, 'findUserRefershToken').mockResolvedValue(null);

      const mutation = `
        mutation {
          createAccessToken {
            accessToken
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

      expect(result.errors?.[0].message).toBe('You are not authorized to perform the operation');
    });
  });
});
