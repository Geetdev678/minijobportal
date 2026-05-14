# Mini Job Portal Dashboard

> A full-stack MERN recruiter dashboard for managing job posts and applicants.

**Live Demo:** [https://your-app.vercel.app](https://your-app.vercel.app)  
**Backend API:** [https://your-api.railway.app/api/v1](https://your-api.railway.app/api/v1)

## Features
- JWT Authentication (Signup/Login)
- Create, Edit, Delete Job Posts
- Manage Applicants with status pipeline
- Search, Filter, and Pagination
- Dark Mode
- Fully Responsive

## Quick Start (Local)

### Prerequisites
- Node.js 20+
- MongoDB Atlas URI (or local MongoDB)
- Git

### 1. Clone
```bash
git clone https://github.com/your-username/mini-job-portal.git
cd mini-job-portal
```

### 2. Backend
```bash
cd server
cp .env.example .env   # fill in your values
npm install
npm run dev
```

### 3. Frontend
```bash
cd client
cp .env.example .env   # set VITE_API_BASE_URL
npm install
npm run dev
```

### Docker (Alternative)
```bash
docker-compose up --build
```
Frontend: http://localhost:3000  
Backend: http://localhost:5000

## Render Deployment
This project includes a `render.yaml` file for deploying both services with Render.

- Backend service root: `server/`
- Frontend static site root: `client/`

After connecting the repo in Render, set these environment variables:

Backend (Web Service):
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/jobportal
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=https://your-frontend-site.onrender.com
NODE_ENV=production
```

Frontend (Static Site):
```
VITE_API_BASE_URL=https://your-backend-site.onrender.com/api/v1
```

## API Docs
See `/server/postman_collection.json` — import into Postman.

## Project Structure
See PRD for full folder structure.