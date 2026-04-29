<template>
  <div class="min-h-screen bg-bg-base text-text-primary">
    <NavBar :isConnected="true" />
    <main class="p-8">
      <StatCards :robots="fakeRobots" />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
        <RobotCard 
          v-for="robot in fakeRobots" 
          :key="robot.id"
          :robot="robot"
          @command="openCommand"
        />
      </div>
    </main>

    <CommandPanel 
      :robot="selectedRobot"
      @close="selectedRobot = null"
      @send="handleSend"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import StatCards from './components/StatCards.vue'
import RobotCard from './components/RobotCard.vue'
import CommandPanel from './components/CommandPanel.vue'
import type { Robot, RobotCommand } from './types'

const fakeRobots: Robot[] = [
  { id: 1, name: 'R1-Alpha', status: 'idle', battery: 100, facility: 'Warehouse A', location: 'North York', updated_at: '' },
  { id: 2, name: 'R2-Bravo', status: 'moving', battery: 72, facility: 'Warehouse A', location: 'North York', updated_at: '' },
  { id: 3, name: 'R3-Charlie', status: 'error', battery: 18, facility: 'Hospital B', location: 'Downtown', updated_at: '' },
  { id: 4, name: 'R4-Delta', status: 'charging', battery: 45, facility: 'Hospital B', location: 'Downtown', updated_at: '' },
]

const selectedRobot = ref<Robot | null>(null)

function openCommand(robot: Robot) {
  selectedRobot.value = robot
}

function handleSend(robot: Robot, command: RobotCommand) {
  console.log(`Sending ${command} to ${robot.name}`)
  selectedRobot.value = null
}
</script>