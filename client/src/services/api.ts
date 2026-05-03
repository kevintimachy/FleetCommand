import type { Robot, RobotCommand, Command } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL

export async function fetchRobots(): Promise<Robot[]> {
    const res = await fetch(`${BASE_URL}/robots`)
    if (!res.ok) throw new Error('Failed to fetch robots')
    return res.json()
}

export async function sendCommand(robotId: number, command: RobotCommand): Promise<void> {
    const res = await fetch(`${BASE_URL}/robots/${robotId}/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
    })
    if (!res.ok) throw new Error('Failed to send command')
}

export async function fetchHistory(robotId: number): Promise<Command[]> {
    const res = await fetch(`${BASE_URL}/robots/${robotId}/history`)
    if (!res.ok) throw new Error('Failed to fetch history')
    const data = await res.json()
    return data.history
}