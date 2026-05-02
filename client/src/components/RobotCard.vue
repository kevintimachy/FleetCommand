<template>
  <div 
    class="bg-bg-card border border-border rounded-xl p-5 flex flex-col gap-4 hover:border-border-accent hover:bg-bg-card-hover transition-all duration-300 cursor-pointer h-full">
    
    <!-- Header -->
    <div class="flex items-center justify-between gap-2">
      <span class="font-bold text-text-primary tracking-wide truncate">{{ robot.name }}</span>
      <span 
        class="text-xs px-2 py-1 rounded-full font-medium tracking-wider uppercase whitespace-nowrap shrink-0"
        :style="{ color: statusColor, backgroundColor: statusGlow }">
        {{ robot.status }}
      </span>
    </div>

    <!-- Facility -->
    <div class="text-text-secondary text-xs tracking-wide truncate">
      📍 {{ robot.facility }} — {{ robot.location }}
    </div>

    <!-- Battery -->
    <div class="flex flex-col gap-1">
      <div class="flex justify-between text-xs">
        <span class="text-text-secondary">Battery</span>
        <span :style="{ color: batteryColor }">{{ robot.battery }}%</span>
      </div>
      <div class="w-full bg-border rounded-full h-1.5">
        <div 
          class="h-1.5 rounded-full transition-all duration-500"
          :style="{ width: robot.battery + '%', backgroundColor: batteryColor }">
        </div>
      </div>
    </div>

    <!-- Spacer pushes button to bottom -->
    <div class="flex-1"></div>

    <!-- Buttons -->
    <div class="flex gap-2">
      <button 
        @click="$emit('command', robot)"
        class="flex-1 py-2 rounded-lg text-xs font-medium tracking-wider uppercase border border-border text-text-secondary hover:border-accent hover:text-accent transition-all duration-300">
        Command
      </button>
      <button 
        @click="$emit('history', robot)"
        class="flex-1 py-2 rounded-lg text-xs font-medium tracking-wider uppercase border border-border text-text-secondary hover:border-accent hover:text-accent transition-all duration-300">
        History
      </button>
    </div>

  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue'
import type { Robot, RobotStatus } from '../types'

const props = defineProps<{
    robot: Robot
}>()

defineEmits < {
  command: [robot: Robot]
  history: [robot: Robot]
}>()

const statusColors: Record<RobotStatus, string> = {
    idle: '#00b894',
    moving: '#00b4d8',
    working: '#a855f7',
    charging: '#f59e0b',
    error: '#ff6b6b',
    offline: '#2d4a6b'
}

const statusColor = computed(() => statusColors[props.robot.status])
const statusGlow = computed(() => `${statusColors[props.robot.status]}20`)

const batteryColor = computed(() => { 
    if (props.robot.battery > 50) return '#00b894'
    if (props.robot.battery > 20) return '#f59e0b'
    return '#ff6b6b'
})
</script>