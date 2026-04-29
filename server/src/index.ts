import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import robotRoutes from './routes/robots'
import { initWebSocket } from './websocket/server'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/robots', robotRoutes)

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() })
})

// Create HTTP server and attach WebSocket
const server = http.createServer(app)
initWebSocket(server)

server.listen(PORT, () => {
    console.log(`FleetCommand API running on port ${PORT}`)
    console.log(`WebSocket server running on ws://localhost:${PORT}`)
})

export default app