import { IReview } from './review.interface';
import { addReviewDto } from './review.dto';
import * as reviewService from './review.service';
import { ApolloError } from 'apollo-server';
import * as yup from 'yup';
import { Context } from '../../middleware/interface';

/**
 * Controller function to add a new review.
 *
 * @param {any} _ - The parent resolver's result.
 * @param {IReview} data - The data to add a new review.
 * @param {Context} context - The context object containing request information.
 * @returns {Promise<any>} - The newly created review object.
 * @throws {ApolloError} - If validation fails or an error occurs during review creation.
 */
export const addReview = async (_: any, data: IReview, context: Context): Promise<any> => {
  try {
    await addReviewDto.validate(data, { abortEarly: false });
    return await reviewService.createReview(data, context?.user?.user?.id);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};

/**
 * Controller function to fetch reviews written by the authenticated user.
 *
 * @param {any} _ - The parent resolver's result.
 * @param {{}} _ - Empty object, since no parameters are required for fetching user's reviews.
 * @param {Context} context - The context object containing request information.
 * @returns {Promise<any>} - An array of reviews written by the authenticated user.
 * @throws {ApolloError} - If an error occurs during fetching reviews.
 */
export const getMyReviews = async (_: any, {}: {}, context: Context): Promise<any> => {
  try {
    return await reviewService.fetchMyReviews(context?.user?.user?.id);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};

/**
 * Controller function to fetch reviews for a specific book.
 *
 * @param {any} _ - The parent resolver's result.
 * @param {{ bookId: number, query: { page: number, rowsPerPage: number }}} data - The ID of the book and optional pagination/search parameters.
 * @returns {Promise<any>} - An array of reviews for the specified book.
 * @throws {ApolloError} - If an error occurs during fetching reviews.
 */
export const getReviews = async (_: any, data: { bookId: number, query: { page: number, rowsPerPage: number} }): Promise<any> => {
  try {
    return await reviewService.fetchBookReviews(data?.bookId, data?.query);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};

/**
 * Controller function to update a review written by the authenticated user.
 *
 * @param {any} _ - The parent resolver's result.
 * @param {{ reviewId: number, rating: number, comment: string }} data - The ID of the review to update, along with new rating and comment.
 * @param {Context} context - The context object containing request information.
 * @returns {Promise<any>} - The updated review object.
 * @throws {ApolloError} - If validation fails or an error occurs during review update.
 */
export const updateReview = async (_: any, data: { reviewId: number, rating: number, comment: string }, context: Context): Promise<any> => {
  try {
    return await reviewService.updateMyReview(data, context?.user?.user?.id);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};

/**
 * Controller function to delete a review written by the authenticated user.
 *
 * @param {any} _ - The parent resolver's result.
 * @param {{ reviewId: number }} data - The ID of the review to delete.
 * @param {Context} context - The context object containing request information.
 * @returns {Promise<any>} - The deleted review object.
 * @throws {ApolloError} - If an error occurs during review deletion.
 */
export const deleteReview = async (_: any, data: { reviewId: number }, context: Context): Promise<any> => {
  try {
    return await reviewService.deleteMyReview(data?.reviewId, context?.user?.user?.id);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};
