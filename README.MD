# PayTM Clone Backend

A simple backend API for a PayTM-like application that allows users to sign up, sign in, view their balance, and transfer money to other users.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [User Routes](#user-routes)
- [Account Routes](#account-routes)
- [License](#license)

---

## Features

- User registration and authentication (JWT-based)
- Secure password storage
- View account balance
- Transfer funds between users (transactional)
- Input validation using Zod
- MongoDB for persistent storage

---

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd paytm/server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**  
   Create a `.env` file in the `server` directory:
   ```
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

4. **Start the server:**
   ```bash
   node index.js
   ```
   The server will run on `http://localhost:3000`.

---

## Environment Variables

| Variable      | Description                |
|---------------|---------------------------|
| MONGODB_URI   | MongoDB connection string |
| JWT_SECRET    | Secret for JWT signing    |

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

---

### User Routes

#### `POST /api/v1/user/signup`

- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "username": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - `200 OK`
    ```json
    {
      "message": "User created successfully",
      "token": "<jwt-token>"
    }
    ```
  - `400 Bad Request` for invalid input
  - `409 Conflict` if email already taken

---

#### `POST /api/v1/user/signin`

- **Description:** Authenticate a user and receive a JWT.
- **Request Body:**
  ```json
  {
    "username": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - `200 OK`
    ```json
    {
      "token": "<jwt-token>"
    }
    ```
  - `411` for invalid credentials

---

#### `PUT /api/v1/user/`

- **Description:** Update user profile (requires authentication).
- **Headers:**  
  `Authorization: Bearer <jwt-token>`
- **Request Body:** (any or all fields)
  ```json
  {
    "password": "newpassword",
    "firstName": "Jane",
    "lastName": "Smith"
  }
  ```
- **Response:**
  - `200 OK`
    ```json
    {
      "message": "Updated successfully"
    }
    ```
  - `411` for invalid input

---

#### `GET /api/v1/user/bulk?filter=<string>`

- **Description:** Search users by first or last name.
- **Response:**
  - `200 OK`
    ```json
    {
      "user": [
        {
          "username": "user@example.com",
          "firstName": "John",
          "lastName": "Doe",
          "_id": "<user-id>"
        }
      ]
    }
    ```

---

### Account Routes

#### `GET /api/v1/account/balance`

- **Description:** Get the authenticated user's account balance.
- **Headers:**  
  `Authorization: Bearer <jwt-token>`
- **Response:**
  - `200 OK`
    ```json
    {
      "balance": 1234.56
    }
    ```

---

#### `POST /api/v1/account/transfer`

- **Description:** Transfer funds to another user (requires authentication).
- **Headers:**  
  `Authorization: Bearer <jwt-token>`
- **Request Body:**
  ```json
  {
    "amount": 100,
    "to": "<recipient_user_id>"
  }
  ```
- **Response:**
  - `200 OK`
    ```json
    {
      "message": "Transfer successful"
    }
    ```
  - `400 Bad Request` for insufficient balance or invalid account

---

## License

This project is licensed under the ISC License.