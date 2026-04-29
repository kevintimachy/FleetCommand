import { Router, Request, Response } from "express";
import pool from "../db/database";
import { RobotCommand, RobotStatus } from '../types'


const router = Router();


// GET /api/robots - get all robots with facility info
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
        SELECT  r.id, r.name, r.status, r.battery,
                r.updated_at, f.name AS facility,
                f.location
        FROM robots r
        JOIN facilities f ON r.facility_id = f.id
        ORDER BY f.name, r.name
    `)
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch robots' })
    }
})

// GET /api/robots/:id - get one robot
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await pool.query(`
        SELECT  r.id, r.name, r.status, r.battery,
                r.updated_at, f.name AS facility,
                f.location
        FROM robots r
        JOIN facilities f ON r.facility_id = f.id
        WHERE r.id = $1
    `, [id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Robot not found' })
        }

        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch robot' })
    }
})

// POST /api/robots/:id/command - send command to robot
router.post('/:id/command', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { command } = req.body as { command: RobotCommand }

        const validCommands: RobotCommand[] = ['move', 'work', 'charge', 'stop', 'shutdown']
        if (!command || !validCommands.includes(command)) {
            return res.status(400).json({ error: 'Invalid command. Use: move, work, charge, stop, shutdown' })
        }

        // Get current robot status
        const robotResult = await pool.query(
            'SELECT * FROM robots WHERE id = $1', [id]
        )

        if (robotResult.rows.length === 0) {
            return res.status(404).json({ error: 'Robot not found' })
        }

        const robot = robotResult.rows[0]
        const previousStatus: RobotStatus = robot.status

        // Map command to new status
        const statusMap: Record<RobotCommand, RobotStatus> = {
            move: 'moving',
            work: 'working',
            charge: 'charging',
            stop: 'idle',
            shutdown: 'offline'
        }

        const newStatus = statusMap[command]

        // Update robot status
        await pool.query(
            'UPDATE robots SET status = $1 WHERE id = $2',
            [newStatus, id]
        )

        // Save command to history
        await pool.query(`
            INSERT INTO commands (robot_id, command, previous_status, new_status)
            VALUES ($1, $2, $3, $4)
    `, [id, command, previousStatus, newStatus])

        res.json({
            success: true,
            message: `Robot ${robot.name} is now ${newStatus}`,
            previousStatus,
            newStatus
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to send command' })
    }
})

// GET /api/robots/:id/history - get last 5 commands
router.get('/:id/history', async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const result = await pool.query(`
            SELECT command, previous_status, new_status, timestamp
            FROM commands
            WHERE robot_id = $1
            ORDER BY timestamp DESC
            LIMIT 5
    `, [id])

        res.json({ robotId: id, history: result.rows })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch history' })
    }
})

export default router
