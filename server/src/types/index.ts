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

export interface Facility {
    id: number
    name: string
    location: string
    created_at: Date
}

export interface Robot {
    id: number
    name: string
    status: RobotStatus
    battery: number
    facility_id: number
    created_at: Date
    updated_at: Date
}

export interface Command {
    id: number
    robot_id: number
    command: RobotCommand
    previous_status: RobotStatus
    new_status: RobotStatus
    timestamp: Date
}