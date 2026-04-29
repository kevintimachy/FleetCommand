export type RobotStatus =
    | 'idle'
    | 'moving'
    | 'working'
    | 'charging'
    | 'error'
    | 'offline'

export type RobotCommand =
    | 'move'
    | 'work'
    | 'charge'
    | 'stop'
    | 'shutdown'

export interface Robot {
    id: number
    name: string
    status: RobotStatus
    battery: number
    facility: string
    location: string
    updated_at: string
}

export interface Command {
    command: RobotCommand
    previous_status: RobotStatus
    new_status: RobotStatus
    timestamp: string
}