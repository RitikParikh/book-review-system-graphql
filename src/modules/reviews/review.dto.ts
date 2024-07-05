import * as yup from 'yup';

export const addReviewDto = yup.object().shape({
    bookId: yup.number().required('Book Id is required'),
    comment: yup.string().required('Book comment is required'),
    rating: yup.number().required('rating is required'),
  });