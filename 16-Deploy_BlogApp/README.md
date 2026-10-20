# 16-Deploy_BlogApp

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `MONGODB_URI` and `JWT_SECRET`.
4. Run `npm start`.

## Deploy on AWS

Upload and extract this folder, then install dependencies with `npm install` and start it with `npm start` (or configure the service to use the `start` script). Set these environment variables in your AWS service configuration:

- `MONGODB_URI`: your reachable MongoDB connection string (for example, MongoDB Atlas). `localhost` refers to the AWS host, not your development computer.
- `JWT_SECRET`: a long random secret. Keep it private and do not commit it.
- `PORT`: set this only if your AWS hosting service does not provide it automatically; the app defaults to `8000`.

The app stores uploaded images under `public/images`. For hosting where local disk is temporary or replaced during deploys, use persistent storage or object storage for uploads.
