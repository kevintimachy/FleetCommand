# ⚡ FleetCommand

A real-time robot fleet management dashboard built with Vue.js, TypeScript, Node.js, and PostgreSQL.

![Stack](https://img.shields.io/badge/Vue.js-3-4FC08D?style=flat&logo=vue.js)
![Stack](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Stack](https://img.shields.io/badge/Node.js-18-339933?style=flat&logo=node.js)
![Stack](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql)
![Stack](https://img.shields.io/badge/WebSockets-Live-00b4d8?style=flat)

## Overview

FleetCommand simulates a real-world robot operations platform — the kind used in warehouses, hospitals, and manufacturing facilities. It demonstrates full stack development with real-time capabilities, production-grade database design, and a clean mission control UI.

## Features

- **Live Robot Dashboard** — monitor 12 robots across 4 facilities in real time
- **Instant Commands** — send move, work, charge, stop, and shutdown commands with immediate WebSocket broadcast
- **Command History** — view the last 5 commands per robot with status transitions
- **Battery Simulation** — robots drain and charge automatically, triggering status changes
- **Race Condition Prevention** — lock flag ensures simulation and user commands never conflict
- **Multi-client Sync** — all connected dashboards stay in sync simultaneously

## Tech Stack

### Frontend
- Vue 3 + TypeScript
- Tailwind CSS v4
- WebSocket client

### Backend
- Node.js + TypeScript
- Express REST API
- WebSocket server (ws)
- PostgreSQL connection pooling (pg)

### Database
- PostgreSQL 16
- Custom ENUMs for type-safe status and commands
- Triggers for automatic `updated_at` timestamps
- Parameterized queries — SQL injection safe

## Architecture

```
Vue.js Frontend
      ↕ REST API (commands, history)
      ↕ WebSocket (live broadcasts)
Node.js + Express
      ↕ Connection Pool
PostgreSQL Database
```

## Broadcast Strategy

FleetCommand uses two broadcast flows:

1. **User commands** → instant WebSocket broadcast after database update
2. **Background simulation** → periodic battery drain and status changes every 10 seconds

A single `broadcastAllRobots()` function always fetches fresh data before sending, preventing stale data issues.

## Database Schema

```sql
facilities  → id, name, location
robots      → id, name, status, battery, facility_id, created_at, updated_at
commands    → id, robot_id, command, previous_status, new_status, timestamp
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 16

### Setup

**1. Clone the repo:**
```bash
git clone https://github.com/YOUR_USERNAME/FleetCommand.git
cd FleetCommand
```

**2. Set up the database:**
```bash
psql postgres -c "CREATE DATABASE fleetcommand;"
psql fleetcommand < database/setup.sql
```

**3. Start the backend:**
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

**4. Start the frontend:**
```bash
cd client
npm install
npm run dev
```

**5. Open your browser:**
```
http://localhost:5173
```

## Environment Variables

Create a `.env` file in the `server` folder:

```
PORT=3001
DATABASE_URL=postgresql://localhost:5432/fleetcommand
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/robots` | Get all robots with facility info |
| GET | `/api/robots/:id` | Get single robot |
| POST | `/api/robots/:id/command` | Send command to robot |
| GET | `/api/robots/:id/history` | Get last 5 commands |
| GET | `/health` | Health check |

## WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `robots_update` | Server → Client | Broadcasts full robot list |

## Author

Kevin — Full Stack Developer