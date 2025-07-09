# Auth Service - Vtonomy E-commerce

The Auth Service is responsible for handling authentication and authorization within the Vtonomy E-commerce microservice architecture. It provides functionalities such as user registration, login, email verification, token management, and role-based access control.

## Features

- Register and login with email and password
- Email verification using token-based confirmation
- Access and Refresh token generation using JWT
- Refresh token rotation and invalidation
- Logout and token revocation
- Forgot and reset password functionality
- Change password for authenticated users
- Retrieve authenticated user information
- Role-based access control (RBAC)
- Optional integration with social login providers (Google, Facebook)

## Tech Stack

- NestJS (TypeScript)
- JWT (Access and Refresh tokens)
- Bcrypt for password hashing
- RabbitMQ for inter-service communication
- MongoDB or PostgreSQL for user data storage
- Redis (optional) for session or token storage

## API Endpoints

| Method | Endpoint               | Description                        |
|--------|------------------------|------------------------------------|
| POST   | `/auth/register`       | Register a new user                |
| POST   | `/auth/login`          | Authenticate user and generate tokens |
| POST   | `/auth/verify-email`   | Verify email using a token         |
| POST   | `/auth/refresh-token`  | Issue new access token             |
| POST   | `/auth/logout`         | Revoke current refresh token       |
| POST   | `/auth/forgot-password`| Send password reset instructions   |
| POST   | `/auth/reset-password` | Reset password using a token       |
| POST   | `/auth/change-password`| Change password (requires login)   |
| GET    | `/auth/me`             | Get current user information       |