import prisma from '../../connection';
import { Review } from '@prisma/client';
import { IReview } from './review.interface';

/**
 * Create a new review for a book.
 *
 * @param {IReview} data - The review data including book ID, rating, and comment.
 * @param {number} userId - The ID of the user creating the review.
 * @returns {Promise<Review>} - The newly created review object.
 * @throws {Error} - Throws an error if creating the review fails.
 */
export const createReview = async (data: IReview, userId: number): Promise<Review> => {
    try {
        data = {...data, userId: userId};
        return await prisma.review.create({ data });
    } catch (error) {
        throw error;
    }
};

/**
 * Fetch all reviews written by a specific user.
 *
 * @param {number} userId - The ID of the user whose reviews are to be fetched.
 * @returns {Promise<Review[]>} - An array of reviews written by the specified user.
 * @throws {Error} - Throws an error if fetching the reviews fails.
 */
export const fetchMyReviews = async (userId: number): Promise<Review[]> => {
    try {
        return await prisma.review.findMany({
            where: { userId },
            include: {
                book: true // Include related book information in the result
            },
        });
    } catch (error) {
        throw error;
    }
};

/**
 * Fetch reviews for a specific book with optional pagination.
 *
 * @param {number} bookId - The ID of the book for which reviews are to be fetched.
 * @param {{ page: number, rowsPerPage: number }} query - Pagination options (page number and rows per page).
 * @returns {Promise<Review[]>} - An array of reviews for the specified book.
 * @throws {Error} - Throws an error if fetching the reviews fails.
 */
export const fetchBookReviews = async (bookId: number, query: { page: number, rowsPerPage: number }): Promise<Review[]> => {
    try {
        const rowsPerPage = Number(query.rowsPerPage) || 0, page = query.page || 0;
        const limit: number = (rowsPerPage != 0) ? rowsPerPage : 0;

        return await prisma.review.findMany({ where: { bookId }, take: limit, skip: page * rowsPerPage });
    } catch (error) {
        throw error;
    }
};

/**
 * Update a review written by the authenticated user.
 *
 * @param {{ reviewId: number, rating: number, comment: string }} data - The ID of the review to update, along with new rating and comment.
 * @param {number} userId - The ID of the user who owns the review.
 * @returns {Promise<Review>} - The updated review object.
 * @throws {Error} - Throws an error if updating the review fails.
 */
export const updateMyReview = async (data: { reviewId: number, rating: number, comment: string }, userId: number): Promise<Review> => {
    try {
        return await prisma.review.update({
            data: { rating: data.rating, comment: data?.comment },
            where: { userId, id: data.reviewId },
            include: {
                book: true // Include related book information in the result
            },
        });
    } catch (error) {
        throw error;
    }
};

/**
 * Delete a review written by the authenticated user.
 *
 * @param {number} reviewId - The ID of the review to delete.
 * @param {number} userId - The ID of the user who owns the review.
 * @returns {Promise<Review>} - The deleted review object.
 * @throws {Error} - Throws an error if deleting the review fails.
 */
export const deleteMyReview = async (reviewId: number, userId: number): Promise<Review> => {
    try {
        return await prisma.review.delete({ where: { id: reviewId, userId } });
    } catch (error) {
        throw error;
    }
};
