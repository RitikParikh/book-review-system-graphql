import * as yup from 'yup';

export const registerUserDto = yup.object().shape({
    email: yup.string().required('Email is required').email("Invalid email format"),
    password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
    username: yup.string().required('User Name is required'),
  });