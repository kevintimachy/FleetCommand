import type { Robot } from '../types'

const WS_URL = import.meta.env.VITE_WS_URL

export function createWebSocket(
    onRobotsUpdate: (robots: Robot[]) => void,
    onConnectionChange: (connected: boolean) => void
) {
    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
        console.log('WebSocket connected')
        onConnectionChange(true)
    }

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if (message.type === 'robots_update') {
            onRobotsUpdate(message.data)
        }
    }

    ws.onclose = () => {
        console.log('WebSocket disconnected')
        onConnectionChange(false)
    }

    ws.onerror = (err) => {
        console.error('WebSocket error:', err)
        onConnectionChange(false)
    }

    return ws
}