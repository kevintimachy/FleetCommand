import { WebSocketServer, WebSocket } from 'ws'
import { Server } from 'http'
import pool from '../db/database'

let wssInstance: WebSocketServer | null = null
let isSimulating = false

// Single broadcast source — always fetches fresh data
export async function broadcastAllRobots() {
    if (!wssInstance) return

    try {
        const result = await pool.query(`
      SELECT r.id, r.name, r.status, r.battery,
             r.updated_at, f.name AS facility,
             f.location
      FROM robots r
      JOIN facilities f ON r.facility_id = f.id
      ORDER BY f.name, r.name
    `)

        const message = JSON.stringify({
            type: 'robots_update',
            data: result.rows
        })

        wssInstance.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message)
            }
        })
    } catch (err) {
        console.error('Broadcast error:', err)
    }
}

async function simulateRobots() {
    if (isSimulating) return
    isSimulating = true

    try {
        const result = await pool.query('SELECT * FROM robots')
        const robots = result.rows

        for (const robot of robots) {
            let newBattery = robot.battery
            let newStatus = robot.status

            // Battery drain
            if (robot.status !== 'charging' && robot.status !== 'offline') {
                newBattery = Math.max(0, robot.battery - Math.floor(Math.random() * 5 + 1))
            }

            // Charging
            if (robot.status === 'charging') {
                newBattery = Math.min(100, robot.battery + 5)
                if (newBattery === 100) newStatus = 'idle'
            }

            // Battery critical
            if (newBattery === 0) {
                newStatus = 'offline'
            } else if (newBattery < 20 && robot.status !== 'charging' && robot.status !== 'error') {
                newStatus = 'error'
            }

            // Random status flips
            const shouldFlip = Math.random() < 0.2
            if (shouldFlip && newBattery >= 20) {
                if (robot.status === 'idle') {
                    newStatus = Math.random() < 0.5 ? 'moving' : 'working'
                } else if (robot.status === 'moving' || robot.status === 'working') {
                    newStatus = 'idle'
                }
            }

            // Update database if anything changed
            if (newBattery !== robot.battery || newStatus !== robot.status) {
                await pool.query(
                    'UPDATE robots SET battery = $1, status = $2 WHERE id = $3',
                    [newBattery, newStatus, robot.id]
                )
            }
        }

        // Use single broadcast source
        await broadcastAllRobots()

    } catch (err) {
        console.error('Simulation error:', err)
    } finally {
        isSimulating = false
    }
}

export function initWebSocket(server: Server) {
    wssInstance = new WebSocketServer({ server })

    console.log('WebSocket server initialized')

    setInterval(simulateRobots, 10000)

    wssInstance.on('connection', (ws) => {
        console.log('New WebSocket client connected')

        // Send current data immediately on connection
        broadcastAllRobots()

        ws.on('close', () => {
            console.log('WebSocket client disconnected')
        })
    })

    return wssInstance
}