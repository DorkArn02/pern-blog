# PERN stack blog

## Project description

This is a fullstack blog website. It was made with: PostgreSQL, Express.js, React.js, Node.js

## Backend API docs

### Authentication endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/check` (Check the user's JWT httpOnly token)

### Post endpoints

- `POST /posts/` (Create post)
- `GET /posts/` (Get all posts)
- `GET /posts/:id` (Get post by id)
- `DELETE /posts/:id` (Delete post by id)
- `PUT /posts/:id` (Update post by id)

### Comment endpoints

- `POST /comments/` (Create comment)
- `GET /comments/:id` (Get comments by post id)
- `DELETE /comments/:id` (Delete comment by id)
- `PUT /comments/:postId/:commentId` (Update a comment by post id and comment id)

### User endpoints

- `GET /users/:id` (Get user details by id)
- `GET /users/picture/:id` (Get user profile picture)
- `DELETE /users/:id` (Delete user by id)
- `PUT /users/:id` (Update user by id)

## Features

- Authentication/Authorization with Jsonwebtoken
- Create account, modify account, delete account
- Login
- Kick user after the token expiration
- Manage posts/comments
- Order comments by time
- Display datetime (moment.js)
- Responsive navbar and cards (chakra-ui)
- Toast messages (chakra-ui)
- Rich text editor (react-quill)
- Load html text from database (react-html-parser)
- Error handling (react-router-dom)
- Store profile pictures on the disk (multer)
- Schema validation (yup)
- ORM with PostgreSQL (sequelize)
- Encrypt the passwords (bcrypt)
- Manage the cookies (cookie-parser)

## Database
![image](https://user-images.githubusercontent.com/28065716/213505024-bcaa6287-bb9c-4747-8a6f-6e92bdb1d4b2.png)
