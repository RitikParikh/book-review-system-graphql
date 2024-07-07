import { IReview } from './review.interface';
import { addReviewDto } from './review.dto';
import * as reviewService from './review.service';
import { ApolloError } from 'apollo-server';
import * as yup from 'yup';
import { Context } from '../../middleware/interface';


export const addReview = async (_: any, data: any,context : Context) => {
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

export const getMyReviews = async (_: any,{}, context: Context) => {
  try {
    return await reviewService.fetchMyReviews(context?.user?.user?.id);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};

export const getReviews = async (_: any, data: {bookId: number, query  :{ page : number | undefined, rowsPerPage : number | undefined, search : string | undefined }}) => {
  try {
    return await reviewService.fetchBookReviews(data?.bookId, data?.query);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};

export const updateReview = async (_: any, data: {reviewId: number, rating:number, comment:string}, context: Context) => {
  try {
    return await reviewService.updateMyReview(data, context?.user?.user?.id);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};


export const deleteReview = async (_: any, data: {reviewId: number}, context : Context) => {
  try {
    return await reviewService.deleteMyReview(data?.reviewId, context?.user?.user?.idd);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ApolloError(error.errors.join(', '));
    }
    throw error;
  }
};