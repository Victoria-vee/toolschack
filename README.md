# GoodTools

GoodTools is an API used for discovering and sharing AI tools. Here, users can create an account and add ai tools they found useful and browse for other recommended tools.

## Features

* User registration and login
* Submit AI tools
* Retrieve all AI tools
* Retrieve popular tools
* Upvote tools
* Remove an upvote
* Delete tools
* Add Comments
* Get comments related to a specific tool

## Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT
* bcrypt
* Railway

## Live API

**Base URL:** `toolschack-production.up.railway.app`

## Getting Started

### Prerequisites

* Node.js
* MongoDB database

### Installation

Clone the repository:

```bash
git clone https://github.com/Victoria-vee/toolschack.git
cd toolschack
```
#### NOTE: Make sure you are on the deploy branch

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
DATABASE_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run in development

```bash
npm run dev
```

### Build the project

```bash
npm run build
```

### Run the production build

```bash
npm start
```

## API Endpoints

* POST /tools — Add a new tool
* GET /tools — Retrieve all tools
* DELETE /tools/:id — Remove a tool by ID
* GET /tools/:id/related — Fetch tools related to a specific tool
* GET /tools/popular — Get the most popular tools
* POST /tools/:id/upvote — Upvote a tool
* DELETE /tools/:id/upvote — Remove an upvote
* POST /tools/:id/comments — Add a comment to a tool
* GET /tools/:id/comments — Retrieve all comments for a tool


## Authentication

Protected endpoints require a JWT access token.

Include the token in the request header:

```text
Authorization: Bearer YOUR_TOKEN
```
## User Authentication

### For registration

```json
{
  "username": "name",
  "email": "email@example.com",
  "password": "password"
}
```

### For Login

```json
{
 "email": "email@example.com",
  "password": "password"
}
```


## Tool Submission

A tool submission requires:

```json
{
  "name": "Tool name",
  "description": "Tool description",
  "category": "Tool category",
  "link": "https://example.com"
}
```
## Comment
```json
{
  "content": "comment"
}
```
## Project Structure

```text
src/
├── users/
│   ├── user.model.ts
│   ├── types.ts
│   ├── user.middleware.ts
│   └── user.routes.ts
│
├── tools/
│   ├── tool.controller.ts
│   ├── tool.routes.ts
│   └── tool.model.ts
│
├── error.ts
└── server.ts
```

## Environment Variables

The following environment variables are required:

* `DATABASE_URI` — MongoDB connection string
* `JWT_SECRET` — Secret used to sign JWT tokens

Do not commit your `.env` file or expose your environment variables publicly.


## Author

Victoria Essien
