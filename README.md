# MERN Authentication Template (JWT)

A full-stack authentication starter built with MongoDB, Express, React, Vite, TypeScript, and shadcn/ui. This project includes secure JWT-based authentication, protected routes, email verification, password reset, session management, and a shared layer for reusable logic across the app.

## Features

- User registration
- User login and logout
- JWT access and refresh token flow
- Secure HTTP-only cookies
- Protected routes and auth middleware
- Email verification with [Resend](https://resend.com)
- Password reset with email links
- Session listing and removal
- Modern UI using shadcn/ui
- Reusable shared types, utilities, and constants
- Full-stack TypeScript setup

## Preview

<img src="./Preview.png" alt="MERN App preview" />

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- [shadcn/ui](https://ui.shadcn.com/)
- React Router

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- [Resend](https://resend.com) for email delivery

### Shared

The `shared` folder contains reusable code used across the application, such as:

- shared TypeScript interfaces
- common validation logic
- constant values
- utility functions
- request/response definitions

This helps keep the frontend and backend consistent and reduces duplication.

## Project Structure

```text
mern-auth-jwt/
├── backend/
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── ...
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   ├── .env.example
│   └── ...
├── shared/
│   ├── types/
│   ├── utils/
│   ├── constants/
│   └── ...
├── .gitignore
├── README.md
├── preview.png
└── ...
```

## Package Manager

This project uses [pnpm](https://pnpm.io/) for dependency management.

## Prerequisites

Before you start, make sure you have:

- Node.js
- pnpm
- MongoDB running locally or a MongoDB Atlas connection
- A [Resend](https://resend.com) API key for email verification and password reset

## Installation

Clone the project:

```bash
git clone https://github.com/FaisalAtiqi/mern-auth-jwt.git
cd mern-auth-jwt
```

## Backend Setup

```bash
cd backend
pnpm install
```

Before running the server, you need to add your ENV variables. Create a `.env` file and use the `sample.env` file as a reference.
For development, you can set the `EMAIL_SENDER` to "onboarding@resend.dev" or a random string, since the emails are sent with a resend sandbox account (when running locally).

Start the backend:

```bash
pnpm run dev
```

The backend may run on:

```text
http://localhost:3000
```

## Frontend Setup

Open a new terminal and run:

```bash
cd frontend
pnpm install
```

Create a `.env` file at the root and add the `VITE_API_URL`. This is the URL of the backend API.

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
pnpm run dev
```

The app may run on:

```text
http://localhost:5173
```

## API Architecture

The API is built using different layers: routes, controllers, services and models.

- Routes are responsible for handling the incoming requests and forwarding them to the appropriate controller.
- Controllers are responsible for validating the request, calling the appropriate service, and sending back the response.
- Services are responsible for handling the business logic. They interact with the database and any external services. Services may also call other services.
- Models are responsible for interacting with the database. They contain the schema and any model utility methods.

\*\*\* For simple GET or DELETE requests that don't require any business logic, the controller may directly interact with the model.

#### Error Handling

Errors are handled using a custom error handler middleware. The error handler middleware catches all errors that occur in the application and processes them accordingly. Each controller needs to be wrapped with the `errorCatch()` utility function to ensure that any errors that are thrown within the controller are caught and passed on to the error handler middleware.

## Authentication Flow

This app uses JWT-based authentication with:

- Access token: short-lived, used for authenticated requests
- Refresh token: long-lived, used to obtain a new access token
- HTTP-only cookies: tokens are stored securely on the client side
- Refresh flow: if the access token expires, the frontend requests a new one from the refresh endpoint

When a user logs in, the server will generate two JWTs: `AccessToken` and `RefreshToken`. Both JWTs are sent back to the client in secure, HTTP-only cookies. The AccessToken is short-lived (30 minutes) and is passed on EVERY request to authenticate the user. The RefreshToken is long-lived (30 days) and is ONLY sent to the `/refresh` endpoint. This endpoint is used to generate a new AccessToken, which will then be passed on subsequent requests.

The frontend has logic that checks for `401 AccessTokenExpired` errors. When this error occurs, the frontend will send a request to the `/refresh` endpoint to get a new AccessToken. If that returns a 200 (meaning a new AccessToken was issued), then the client will retry the original request. This gives the user a seamless experience without having to log in again. If the `/refresh` endpoint errors, the user will be logged out and redirected to the login page.

## API Overview

Typical endpoints include:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/logout`
- `GET /api/auth/refresh`
- `GET /api/auth/verify/:code`
- `POST /api/auth/email/verify/request`
- `POST /api/auth/password/forgot`
- `POST /api/auth/password/reset`

### Postman Collection

There is a Postman collection in the `backend` directory that you can use to test the API. The `postman.json` contains requests for all the routes in the API.

## License

This project is licensed under the MIT License.

## Author

Your Name  
GitHub: [@FaisalAtiqi](https://github.com/FaisalAtiqi)
