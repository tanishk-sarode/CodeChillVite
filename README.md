# CodeChillVite

A collaborative code editor with real-time chat, input/output sync, and more.

## Features
- Collaborative and local code editing
- Real-time chat and user list
- Theme toggle, user count badge, About modal
- “Clear Output” and “Reset All” buttons

## Local Setup

### Backend
```bash
cd server
cp .env.example .env
npm install
npm start
```

### Frontend
```bash
cp .env.example .env
npm install
npm run dev
```

## Deployment

### Backend (Koyeb)
- Push to GitHub
- Create a new Koyeb app from your repo
- Set environment variables (`PORT`, `ALLOWED_ORIGIN`, etc.)
- Deploy!

### Frontend (Vercel)
- Push to GitHub
- Import project in Vercel
- Set `VITE_BACKEND_URL` to your Koyeb backend URL
- Deploy!

## Environment Variables

See `.env.example` for required variables.

## License
MIT
