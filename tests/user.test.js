import { gql } from 'apollo-server';
import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server';
import resolvers from '../src/resolvers';
import typeDefs from '../src/schema';
import { prisma } from '../src/connection';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization || '';
        let user = null;
        if (token) {
            try {
                user = jwt.verify(token, process.env.JWT_SECRET);
            } catch (e) {
                throw new Error('Your session expired. Sign in again.');
            }
        }
        return { user, prisma };
    },
});

const { query, mutate } = createTestClient(server);

describe('User Resolvers', () => {
    it('registers a user', async () => {
        const REGISTER_USER = gql`
            mutation Register($username: String!, $email: String!, $password: String!) {
                register(username: $username, email: $email, password: $password) {
                    id
                    email
                    username
                }
            }
        `;

        const res = await mutate({
            mutation: REGISTER_USER,
            variables: {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            },
        });

        expect(res.data.register).toHaveProperty('id');
        expect(res.data.register).toHaveProperty('email', 'test@example.com');
        expect(res.data.register).toHaveProperty('username', 'testuser');
    });

    it('logs in a user', async () => {
        const LOGIN_USER = gql`
            mutation Login($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                    accessToken
                    refershToken
                }
            }
        `;

        // Ensure user exists in the database
        const password = await bcrypt.hash('password123', 10);
        await prisma.user.create({
            data: {
                username: 'testuser',
                email: 'test@example.com',
                password,
            },
        });

        const res = await mutate({
            mutation: LOGIN_USER,
            variables: {
                email: 'test@example.com',
                password: 'password123',
            },
        });

        expect(res.data.login).toHaveProperty('accessToken');
        expect(res.data.login).toHaveProperty('refershToken');
    });

    it('creates an access token', async () => {
        const CREATE_ACCESS_TOKEN = gql`
            mutation {
                createAccessToken {
                    accessToken
                }
            }
        `;

        const password = await bcrypt.hash('password123', 10);
        const user = await prisma.user.create({
            data: {
                username: 'testuser',
                email: 'test@example.com',
                password,
            },
        });

        const refreshToken = jwt.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: '720h', // 30 days
        });

        await prisma.userToken.create({
            data: {
                userId: user.id,
                refreshToken,
            },
        });

        const res = await mutate({
            mutation: CREATE_ACCESS_TOKEN,
            context: {
                user: { user },
                token: refreshToken,
            },
        });

        expect(res.data.createAccessToken).toHaveProperty('accessToken');
    });
});
