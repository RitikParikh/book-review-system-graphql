export interface RegisterUserArgs {
    username: string;
    email: string;
    password: string;
}
  
export interface UserWithoutPasswordSchmas {
    id: number;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}