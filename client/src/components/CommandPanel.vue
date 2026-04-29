<template>
  <div 
    v-if="robot"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="$emit('close')">
    
    <div class="bg-bg-card border border-border rounded-xl p-6 w-full max-w-md flex flex-col gap-5">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-text-primary font-bold text-lg">{{ robot.name }}</h2>
          <p class="text-text-muted text-xs tracking-wide mt-1">📍 {{ robot.facility }}</p>
        </div>
        <button 
          @click="$emit('close')"
          class="text-text-muted hover:text-text-primary transition-colors text-xl">
          ✕
        </button>
      </div>

      <!-- Current Status -->
      <div class="bg-bg-base rounded-lg p-3 flex items-center justify-between">
        <span class="text-text-secondary text-xs uppercase tracking-wider">Current Status</span>
        <span 
          class="text-xs px-2 py-1 rounded-full font-medium uppercase tracking-wider"
          :style="{ color: statusColor, backgroundColor: statusGlow }">
          {{ robot.status }}
        </span>
      </div>

      <!-- Commands -->
      <div class="flex flex-col gap-2">
        <p class="text-text-muted text-xs uppercase tracking-wider mb-1">Send Command</p>
        <button
          v-for="cmd in commands"
          :key="cmd.value"
          @click="$emit('send', robot, cmd.value)"
          class="w-full py-3 rounded-lg text-sm font-medium tracking-wider uppercase border transition-all duration-300 flex items-center gap-3 px-4"
          :class="cmd.value === 'shutdown' 
            ? 'border-status-error text-status-error hover:bg-status-error/10' 
            : 'border-border text-text-secondary hover:border-accent hover:text-accent'">
          <span>{{ cmd.icon }}</span>
          <span>{{ cmd.label }}</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Robot, RobotCommand, RobotStatus } from '../types'

const props = defineProps<{
  robot: Robot | null
}>()

defineEmits<{
  close: []
  send: [robot: Robot, command: RobotCommand]
}>()

const commands: { value: RobotCommand, label: string, icon: string }[] = [
  { value: 'move', label: 'Move', icon: '🚀' },
  { value: 'work', label: 'Work', icon: '⚙️' },
  { value: 'charge', label: 'Charge', icon: '⚡' },
  { value: 'stop', label: 'Stop', icon: '⏹️' },
  { value: 'shutdown', label: 'Shutdown', icon: '🔴' },
]

const statusColors: Record<RobotStatus, string> = {
  idle: '#00b894',
  moving: '#00b4d8',
  working: '#a855f7',
  charging: '#f59e0b',
  error: '#ff6b6b',
  offline: '#2d4a6b'
}

const statusColor = computed(() => props.robot ? statusColors[props.robot.status] : '')
const statusGlow = computed(() => props.robot ? `${statusColors[props.robot.status]}20` : '')
</script>