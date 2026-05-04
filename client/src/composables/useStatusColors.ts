import type { RobotStatus } from '../types'

export const statusColors: Record<RobotStatus, string> = {
    idle: '#00ff9d',
    moving: '#00b4d8',
    working: '#a855f7',
    charging: '#f59e0b',
    error: '#ff6b6b',
    offline: '#3d5a7a'
}

export function getStatusColor(status: RobotStatus): string {
    return statusColors[status]
}

export function getStatusGlow(status: RobotStatus): string {
    return `${statusColors[status]}20`
}

export function getBatteryColor(battery: number): string {
    if (battery > 50) return '#00ff9d'
    if (battery > 20) return '#f59e0b'
    return '#ff6b6b'
}