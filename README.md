# Book Review System

This is a Book Review System built with TypeScript, Node.js, GraphQL, Apollo Server, Prisma, and PostgreSQL. The project also includes code documentation, and test cases using Jest.

## Table Contents

1. Project Setup
2. Technologies Used
3. API Documentation
4. Authentication
5. License

## Project Setup

Follow these steps to set up and run the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/RitikParikh/book-review-system-graphql.git
   cd book-review-system

2. Install dependencies:
    ```bash
    npm install

3. Set up the database:
    Ensure you have PostgreSQL installed and running. 
    Configure your database credentials in the .env file that you can made from env.sample. Then, apply migrations using Prisma:

    ```bash
    npx prisma migrate dev
    npx prisma db push

4. Start the development server:
    ```bash
    npm run dev

    This will start the Apollo Server at http://localhost:4000 Default Port:4000

5. For the run test cases:
    ```bash
        npm run test
    ```
# Technologies Used
TypeScript
Node.js
GraphQL
Apollo Server
Prisma
PostgreSQL
Jest

# Authentication

Authentication is handled using JWT (JSON Web Tokens). To access authenticated routes or perform mutations requiring authentication, include the access token in the Authorization header:
```bash
 Authorization: Bearer <Token>
```

# API Documentation

## Queries

1. Health Check
   - Description: Check if the server is running.
   - Endpoint: /graphql
   - Usage: GET
   - ```bash
        query {
            healthCheck
        }

2. Get Books
   - Description: Fetch a list of books.
   - Endpoint: /graphql
   - Usage: POST
   -Authentication: Not required
   - ```bash
        query {
            getBooks(query: { page: 1, rowsPerPage: 10, search: "keyword" }) {
                id
                title
                author
                publishedYear
            }
        }

3. Get Book by ID
   - Description: Fetch details of a specific book.
   - Endpoint: /graphql
   - Usage: POST
   -Authentication: Not required
   - ```bash
        query {
            getBook(id: 1) {
                id
                title
                author
                publishedYear
            }
        }

4. Get Reviews By Book Id
   - Description: Fetch details of a specific book all the reviews.
   - Endpoint: /graphql
   - Usage: POST
   -Authentication: Not required
   - ```bash
        query {
            getReviews(bookId: 1, query: {page: 1, rowsPerPage: 10}) {
                id
                userId
                bookId
                rating
                comment
            }
        }

5. Get Logdin User Reviews
   - Description: Fetch details of a logdin user given reviews
   - Endpoint: /graphql
   - Usage: POST
   -Authentication: required
   - ```bash
        query {
            getMyReviews {
                id
                userId
                bookId
                rating
                comment
                book{
                    id
                    title
                    author
                    publishedYear
                }
            }
        }

## Mutations

1. Register user
   - Description: SignUp the user to our system
   - Endpoint: /graphql
   - Usage: POST
   - Authentication: Not Required
   - ```bash
        mutation {
            register(username: "ritik", email: "test@gmail.com", password: '12345678') {
                id
                email
                username
            }
        }

2. User Login
   - Description: SignIn the user to our system using email and password
   - Endpoint: /graphql
   - Usage: POST
   - Authentication: Not Required
   - ```bash
        mutation {
            login(email: "test@gmail.com", password: '12345678') {
                accessToken
                refreshToken
            }
        }

3. Create Access Token
   - Description: This is use for when accesToken exipy then without login using refersh token make new access token from it
   - Endpoint: /graphql
   - Usage: POST
   - Authentication: Required (Authorization: Bearer <Token>)
   - ```bash
        mutation {
            createAccessToken {
                accessToken
            }
        } 

4. Add Book
   - Description: Add a Book into the system
   - Endpoint: /graphql
   - Usage: POST
   - Authentication: Required (Authorization: Bearer <Token>)
   - ```bash
        mutation {
            addBook(title:"GOT", author:"RR Martin", publishedYear:"2024") {
                id
                title
                author
                publishedYear
            }
        } 

5. Add Review
   - Description: Add a Review to a Book
   - Endpoint: /graphql
   - Usage: POST
   - Authentication: Required (Authorization: Bearer <Token>)
   - ```bash
        mutation {
            addReview(bookId:1, rating:3, comment:"Good Book") {
                 id
                userId
                bookId
                rating
                comment
            }
        } 
    
6. Update Review
   - Description: Update own Review for a book
   - Endpoint: /graphql
   - Usage: POST
   - Authentication: Required (Authorization: Bearer <Token>)
   - ```bash
        mutation {
            updateReview(reviewId:1, rating:3, comment:"Good Book") {
                 id
                userId
                bookId
                rating
                comment
            }
        } 

7. Delete Review
   - Description: Delete own Review for a book
   - Endpoint: /graphql
   - Usage: POST
   - Authentication: Required (Authorization: Bearer <Token>)
   - ```bash
        mutation {
            deleteReview(reviewId:1) {
                 id
                userId
                bookId
                rating
                comment
            }
        } 


# License
This project is licensed under the MIT License - see the LICENSE file for details.


Need to remember send headers for middleware authentication --> Authorization : Bearer <Token>