<template>
  <div
    class="bg-bg-card border border-border rounded-xl p-5 flex flex-col gap-4 hover:border-accent hover:bg-bg-card-hover transition-all duration-300 cursor-pointer h-full">

    <!-- Header -->
    <div class="flex items-center justify-between gap-2">
      <span class="font-medium text-text-primary tracking-[0.08em] truncate uppercase text-sm">{{ robot.name }}</span>
      <span
        class="text-xs px-2 py-1 rounded font-medium tracking-[0.1em] uppercase whitespace-nowrap shrink-0"
        :style="{ color: statusColor, backgroundColor: statusGlow }">
        {{ robot.status }}
      </span>
    </div>

    <!-- Facility -->
    <div class="flex flex-col gap-1">
      <span class="text-text-muted text-xs tracking-[0.1em] uppercase truncate">{{ robot.facility }}</span>
      <span class="text-text-muted text-xs tracking-[0.06em] truncate">{{ robot.location }}</span>
    </div>

    <!-- Battery -->
    <div class="flex flex-col gap-2">
      <div class="flex justify-between text-xs">
        <span class="text-text-muted tracking-[0.08em] uppercase">Battery</span>
        <span class="font-medium tabular-nums" :style="{ color: batteryColor }">{{ robot.battery }}%</span>
      </div>
      <div class="w-full bg-border rounded-full h-1">
        <div
          class="h-1 rounded-full transition-all duration-500"
          :style="{ width: robot.battery + '%', backgroundColor: batteryColor }">
        </div>
      </div>
    </div>

    <!-- Spacer -->
    <div class="flex-1"></div>

    <!-- Buttons -->
    <div class="flex gap-2">
      <button
        @click="$emit('command', robot)"
        class="flex-1 py-2 rounded text-xs font-medium tracking-[0.1em] uppercase border border-border text-text-muted hover:border-accent hover:text-accent transition-all duration-300">
        Command
      </button>
      <button
        @click="$emit('history', robot)"
        class="flex-1 py-2 rounded text-xs font-medium tracking-[0.1em] uppercase border border-border text-text-muted hover:border-accent hover:text-accent transition-all duration-300">
        History
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Robot} from '../types'
import { getStatusColor, getStatusGlow, getBatteryColor } from '../composables/useStatusColors'

const props = defineProps<{
  robot: Robot
}>()

defineEmits<{
  command: [robot: Robot]
  history: [robot: Robot]
}>()

const statusColor = computed(() => getStatusColor(props.robot.status))
const statusGlow = computed(() => getStatusGlow(props.robot.status))

const batteryColor = computed(() => getBatteryColor(props.robot.battery))
</script>