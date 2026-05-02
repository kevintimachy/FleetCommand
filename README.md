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

Kevin Timachy — Full Stack Developer