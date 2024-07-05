import * as yup from 'yup';

export const addBookDto = yup.object().shape({
    title: yup.string().required('Book Title is required'),
    author: yup.string().required('Book Author name required'),
    publishedYear: yup.string().required('Publised Year required'),
  });