import { WebSocketServer, WebSocket } from 'ws'
import { Server } from 'http'
import pool from '../db/database'

export function initWebSocket(server: Server) {
    const wss = new WebSocketServer({ server })

    console.log('WebSocket server initialized')

    // Broadcast function to send data to all connected clients
    function broadcast(data: object) {
        const message = JSON.stringify(data)
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message)
            }
        })
    }

    // Simulate robot updates every 5 seconds
    setInterval(async () => {
        try {
            const result = await pool.query(`
            SELECT  r.id, r.name, r.status, r.battery,
                    r.updated_at, f.name AS facility,
                    f.location
            FROM robots r
            JOIN facilities f ON r.facility_id = f.id
            ORDER BY f.name, r.name
      `)

            broadcast({
                type: 'robots_update',
                data: result.rows
            })
        } catch (err) {
            console.error('WebSocket broadcast error:', err)
        }
    }, 5000)

    wss.on('connection', (ws) => {
        console.log('New WebSocket client connected')

        ws.on('close', () => {
            console.log('WebSocket client disconnected')
        })
    })

    return wss
}