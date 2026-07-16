# Secure Blog

A full-stack blog platform with a RESTful API backend (Node.js + Express + MongoDB) and a modern Nuxt 4 frontend (Tailwind CSS v4 + shadcn-vue).

---

## Project Structure

```
secure-blog/
├── backend/                     # Express API server
│   ├── src/
│   │   ├── config/              # MongoDB connection
│   │   ├── controllers/         # Route handlers
│   │   ├── middlewares/         # Auth, error handling, uploads
│   │   ├── models/              # Mongoose schemas
│   │   ├── routes/              # Express routes
│   │   ├── public/uploads/      # Uploaded images
│   │   ├── seed/                # Database seed scripts
│   │   ├── app.js               # Express app setup
│   │   └── server.js            # Entry point
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                    # Nuxt 4 SPA
│   ├── app/
│   │   ├── assets/              # CSS styles
│   │   ├── components/          # Vue components
│   │   ├── composables/         # Shared logic (API, Auth, Theme)
│   │   ├── layouts/             # Page layouts
│   │   ├── middleware/          # Route guards
│   │   ├── pages/               # Route pages
│   │   ├── plugins/             # Nuxt plugins
│   │   └── app.vue              # Root component
│   ├── package.json
│   ├── nuxt.config.ts
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml           # Multi-service orchestration
├── .gitignore
├── .env.example
└── README.md
```

---

## Local Development

### Prerequisites
- Node.js 22+
- MongoDB (local or Docker)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev          # Starts with nodemon on port 5000
npm run seed:admin   # Creates admin@admin.com / admin123
npm run seed:posts   # Seeds 10 sample posts
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev          # Starts on port 3000
```

### Seed Accounts

| Email             | Password  | Role  |
|-------------------|-----------|-------|
| admin@admin.com   | admin123  | admin |

---

## Docker

### Build & Run

```bash
docker compose up --build
```

### Services

| Service   | Port  | URL                       |
|-----------|-------|---------------------------|
| Frontend  | 3000  | http://localhost:3000      |
| Backend   | 5000  | http://localhost:5000      |
| MongoDB   | 27017 | mongodb://localhost:27017  |

### Seed Data in Docker

```bash
docker compose exec backend node src/seed/seedAdmin.js
docker compose exec backend node src/seed/seedPosts.js
```

### Stop

```bash
docker compose down
# Remove volumes to reset data:
docker compose down -v
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable      | Description              | Default                                    |
|---------------|--------------------------|--------------------------------------------|
| `PORT`        | Server port              | `5000`                                     |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/secure-blog`    |
| `JWT_SECRET`  | JWT signing secret       | (required)                                 |

### Frontend (`frontend/.env`)

| Variable               | Description  | Default                  |
|------------------------|--------------|--------------------------|
| `NUXT_PUBLIC_API_URL`  | Backend URL  | `http://localhost:5000`  |

---

## Production Deployment

### Railway

1. Create a new project on [Railway](https://railway.app)
2. Add a MongoDB plugin
3. Add a new service from `backend/` directory
4. Set environment variables:
   - `MONGODB_URI` from MongoDB plugin
   - `JWT_SECRET` (generate a strong secret)
5. Add a new service from `frontend/` directory
6. Set `NUXT_PUBLIC_API_URL` to your backend Railway URL
7. Build command: `npm run build`
8. Start command: `node .output/server/index.mjs`

### Render

1. Create a **Web Service** for the backend from `backend/`:
   - Build Command: `npm install`
   - Start Command: `node src/server.js`
   - Add environment variables
2. Create a **Web Service** for the frontend from `frontend/`:
   - Build Command: `npm run build`
   - Start Command: `node .output/server/index.mjs`
   - Set `NUXT_PUBLIC_API_URL` to backend Render URL
3. Use [Render MongoDB](https://render.com/docs/mongodb) or MongoDB Atlas

---

## API Documentation

**Base URL:** `http://localhost:5000/api`

### Auth

| Method | Endpoint         | Description     |
|--------|------------------|-----------------|
| POST   | `/auth/register` | Register user   |
| POST   | `/auth/login`    | Login           |

### Profile

| Method | Endpoint          | Description          |
|--------|-------------------|----------------------|
| GET    | `/profile`        | Get current user     |
| PUT    | `/profile/avatar` | Upload avatar        |

### Posts

| Method | Endpoint      | Description     |
|--------|---------------|-----------------|
| GET    | `/posts`      | Get all posts   |
| GET    | `/posts/:id`  | Get post by ID  |
| POST   | `/posts`      | Create post     |
| PUT    | `/posts/:id`  | Update post     |
| DELETE | `/posts/:id`  | Delete post     |

### Categories

| Method | Endpoint          | Description      |
|--------|-------------------|------------------|
| GET    | `/categories`     | Get all          |
| GET    | `/categories/:id` | Get by ID        |
| POST   | `/categories`     | Create (admin)   |
| PUT    | `/categories/:id` | Update (admin)   |
| DELETE | `/categories/:id` | Delete (admin)   |

### Users (Admin)

| Method | Endpoint      | Description   |
|--------|---------------|---------------|
| GET    | `/users`      | Get all users |
| DELETE | `/users/:id`  | Delete user   |

### Standard Response Format

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {}
}
```

### Authorization

Send the JWT as a Bearer token:
```
Authorization: Bearer <your_token>
```
