<template>
  <div class="flex items-center gap-4 mb-8 pb-6 border-b border-border overflow-x-auto">
    <template v-for="(stat, index) in stats" :key="stat.label">
      <div class="flex items-center gap-2 shrink-0">
        <span class="text-sm font-bold tabular-nums" :style="{ color: stat.color }">{{ stat.value }}</span>
        <span class="text-text-muted text-xs tracking-wider uppercase">{{ stat.label }}</span>
      </div>
      <div v-if="index < stats.length - 1" class="w-px h-3 bg-border shrink-0"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Robot } from '../types'
import { statusColors } from '../composables/useStatusColors';
const props = defineProps<{
  robots: Robot[]
}>()

const stats = computed(() => [
  { label: 'Total', value: props.robots.length, color: '#e8f4fd' },
  { label: 'Active', value: props.robots.filter(r => ['moving', 'working'].includes(r.status)).length, color: statusColors.moving },
  { label: 'Errors', value: props.robots.filter(r => r.status === 'error').length, color: statusColors.error },
  { label: 'Charging', value: props.robots.filter(r => r.status === 'charging').length, color: statusColors.charging },
  { label: 'Offline', value: props.robots.filter(r => r.status === 'offline').length, color: statusColors.offline }
])
</script>