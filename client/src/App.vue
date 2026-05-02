<template>
  <div class="min-h-screen bg-bg-base text-text-primary">
    <NavBar :isConnected="isConnected" />
    <main class="p-8">
      <StatCards :robots="robots" />

      <!-- Loading -->
      <div v-if="loading" class="text-text-muted text-sm tracking-wider uppercase">
        Loading robots...
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-status-error text-sm">
        {{ error }}
      </div>

      <!-- Robot Grid -->
      <div 
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
        <RobotCard 
          v-for="robot in robots" 
          :key="robot.id"
          :robot="robot"
          @command="openCommand"
          @history="openHistory"
        />
      </div>
    </main>

    <CommandPanel 
      :robot="selectedRobot"
      @close="selectedRobot = null"
      @send="handleSend"
    />

    <HistoryList
      :show="historyRobot !== null"
      :robotName="historyRobot?.name || ''"
      :history="history"
      :loading="historyLoading"
      @close="historyRobot = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import NavBar from './components/NavBar.vue'
import StatCards from './components/StatCards.vue'
import RobotCard from './components/RobotCard.vue'
import CommandPanel from './components/CommandPanel.vue'
import HistoryList from './components/HistoryList.vue'

import { fetchRobots, sendCommand, fetchHistory } from './services/api'
import { createWebSocket } from './services/websocket'
import type { Robot, RobotCommand, Command } from './types'

const robots = ref<Robot[]>([])
const selectedRobot = ref<Robot | null>(null)
const isConnected = ref(false)
const loading = ref(true)
const error = ref<string | null>(null)
const historyRobot = ref<Robot | null>(null)
const history = ref<Command[]>([])
const historyLoading = ref(false)

let ws: WebSocket | null = null

onMounted(async () => {
  try {
    robots.value = await fetchRobots()
    loading.value = false
  } catch (err) {
    error.value = 'Failed to load robots'
    loading.value = false
  }

  ws = createWebSocket(
    (updatedRobots) => { robots.value = updatedRobots },
    (connected) => { isConnected.value = connected }
  )
})

onUnmounted(() => {
  ws?.close()
})

function openCommand(robot: Robot) {
  selectedRobot.value = robot
}

async function handleSend(robot: Robot, command: RobotCommand) {
  try {
    await sendCommand(robot.id, command)
    selectedRobot.value = null
  } catch (err) {
    console.error('Failed to send command:', err)
  }
}

async function openHistory(robot: Robot) {
  historyRobot.value = robot
  historyLoading.value = true
  history.value = []
  try {
    history.value = await fetchHistory(robot.id)
  } catch (err) {
    console.error('Failed to fetch history:', err)
  } finally {
    historyLoading.value = false
  }
}
</script>