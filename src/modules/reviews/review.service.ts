import prisma from '../../connection';
import { Review } from '@prisma/client';
import { IReview } from './review.interface';

export const createReview = async (data : IReview, userId: number) => {
    try {
        data = {...data, userId : userId};
        console.log(data);
        return await prisma.review.create({ data });
    } catch (error) {
        throw error;
    }
};

export const fetchMyReviews = async (userId:number) : Promise<Review[]> => {
    try {
        return await prisma.review.findMany({
            where:{userId},
            include: {
              book : true
            },
          });
    } catch (error) {
        throw error;
    }
};

export const fetchBookReviews = async (bookId: number, query : { page : number | undefined, rowsPerPage : number | undefined, search : string | undefined }) => {
    try {
        const rowsPerPage = Number(query.rowsPerPage) || 0, page = query.page || 0;
        const limit: number = (rowsPerPage != 0) ? rowsPerPage : 0;

        return await prisma.review.findMany({ where :{ bookId }, take: limit,skip:  page * rowsPerPage,});
    } catch (error) {
        throw error;
    }
};

export const updateMyReview = async (data: {reviewId: number, rating:number, comment:string},userId:number) => {
    try {
        return await prisma.review.update({
            data:{rating:data.rating, comment: data?.comment},
            where:{userId, id: data.reviewId},
            include: {
              book : true
            },
          });
    } catch (error) {
        throw error;
    }
};

export const deleteMyReview = async (reviewId:number, userId:number) => {
    try {
        return await prisma.review.delete({ where :{ id: reviewId, userId}});
    } catch (error) {
        throw error;
    }
};