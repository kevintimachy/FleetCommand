<template>
  <div
    v-if="robot"
    class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="$emit('close')">

    <div class="bg-bg-card border border-border rounded-xl p-6 w-full max-w-md flex flex-col gap-5">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-text-primary font-medium tracking-[0.12em] uppercase text-sm">{{ robot.name }}</h2>
          <p class="text-text-muted text-xs tracking-[0.08em] mt-1">{{ robot.facility }} · {{ robot.location }}</p>
        </div>
        <button
          @click="$emit('close')"
          class="text-text-muted hover:text-accent transition-colors text-sm tracking-widest">
          ESC
        </button>
      </div>

      <!-- Current Status -->
      <div class="bg-bg-base border border-border rounded p-3 flex items-center justify-between">
        <span class="text-text-muted text-xs uppercase tracking-[0.12em]">Current Status</span>
        <span
          class="text-xs px-2 py-1 rounded font-medium uppercase tracking-[0.1em]"
          :style="{ color: statusColor, backgroundColor: statusGlow }">
          {{ robot.status }}
        </span>
      </div>

      <!-- Commands -->
      <div class="flex flex-col gap-2">
        <p class="text-text-muted text-xs uppercase tracking-[0.12em] mb-1">Send Command</p>
        <button
          v-for="cmd in commands"
          :key="cmd.value"
          @click="$emit('send', robot, cmd.value)"
          class="w-full py-2.5 rounded text-xs font-medium tracking-[0.12em] uppercase border transition-all duration-300 px-4 text-left"
          :class="cmd.value === 'shutdown'
            ? 'border-status-error text-status-error hover:bg-status-error/10'
            : 'border-border text-text-muted hover:border-accent hover:text-accent'">
          {{ cmd.label }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Robot, RobotCommand } from '../types'
import { getStatusColor, getStatusGlow } from '../composables/useStatusColors'

const props = defineProps<{
  robot: Robot | null
}>()

defineEmits<{
  close: []
  send: [robot: Robot, command: RobotCommand]
}>()

const commands: { value: RobotCommand, label: string }[] = [
  { value: 'move', label: 'Move' },
  { value: 'work', label: 'Work' },
  { value: 'charge', label: 'Charge' },
  { value: 'stop', label: 'Stop' },
  { value: 'shutdown', label: 'Shutdown' },
]
const statusColor = computed(() => props.robot ? getStatusColor(props.robot.status) : '')
const statusGlow = computed(() => props.robot ? getStatusGlow(props.robot.status) : '')
</script>