# SENG513-Final-Project-UniPlanner

## Overview

UniPlanner is a full‑stack task and schedule management app.  
- **Backend**: FastAPI + MySQL + Firebase Auth  
- **Frontend**: React + Tailwind + FullCalendar + Firebase Auth  

## Prerequisites

- Docker & Docker Compose (recommended)  
- (Or) Python 3.9+, Node.js 18+, npm  
- Firebase service account key (`firebase_key.json`)  
- Environment variable files in both `backend/` and `frontend/`.

## Obtaining credentials

1. **Firebase service account key**  
   - Go to your Firebase console → Project Settings → Service accounts.  
   - Generate a new private key and save the downloaded JSON as  
     `backend/firebase_key.json`.  
   - **Do not commit** this file to Git.

2. **Backend `.env`** (`backend/.env`)  
   ```dotenv
   # MySQL connection
   DB_USER=root
   DB_PASSWORD=password
   DB_HOST=database
   DB_PORT=3306
   DB_NAME=uniplanner

   # (optional) override any other settings here
   ```

3. **Frontend `.env`** (`frontend/.env`)  
   ```dotenv
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_PROJECT_ID=your_project_id
   REACT_APP_STORAGE_BUCKET=your_project_id.appspot.com
   REACT_APP_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_APP_ID=your_app_id
   ```
   Copy these values from Firebase → Project Settings → General → Your apps.

## Running the project

### 1. Using Docker Compose (recommended)
From the repo root:
```bash
docker-compose up --build
```

- **Backend** → [http://localhost:8000](http://localhost:8000)  
- **Frontend** → [http://localhost:3000](http://localhost:3000)

### 2. Local Development (manual)

#### Backend
```bash
cd backend
python -m venv env
# Windows: env\Scripts\activate
# macOS/Linux: source env/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## Folder structure

- `backend/` → FastAPI service, MySQL models, Firebase auth  
- `frontend/` → React SPA, Tailwind CSS, FullCalendar  
- `docker-compose.yml` → Orchestrates MySQL, backend, frontend