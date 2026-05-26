# CRM (Lead Management) Project

This repository contains a simple CRM/lead management system with a React (Vite) frontend and an Express + MySQL backend. It includes authentication plus CRUD features for leads, staff, branches, profiles, and dashboard data.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MySQL

## Repository Structure

- `front/` – React + Vite client
- `server/` – Express API server and MySQL configuration

## Prerequisites

- Node.js (LTS recommended)
- MySQL (local or remote)

## Setup

### 1) Database

1. Create the database (default name: `lead_management_db`).
2. Import the schema and seed data:

```bash
mysql -u root -p -h 127.0.0.1 -P 3307 lead_management_db < server/backup.sql
```

> Adjust host/port/user/password to match your MySQL setup.

### 2) Backend Configuration

The server reads environment variables from `server/.env`. You can keep the defaults or edit them:

```
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=
DB_NAME=lead_management_db
PORT=5000
```

### 3) Install Dependencies

```bash
cd server
npm ci

cd ../front
npm ci
```

## Run Locally

### Start the API server

```bash
cd server
node server.js
```

The server starts on `http://localhost:5000` by default.

### Start the frontend

```bash
cd front
npm run dev
```

The app runs at `http://localhost:5173`.

## Notes

- `server/backup.sql` includes demo data for users, staff, and leads.
- Update CORS origins in `server/server.js` if you use a different frontend port.
