<template>
  <div 
    v-if="show"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="$emit('close')">

    <div class="bg-bg-card border border-border rounded-xl p-6 w-full max-w-md flex flex-col gap-4">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h2 class="text-text-primary font-bold text-lg">Command History</h2>
        <button 
          @click="$emit('close')"
          class="text-text-muted hover:text-text-primary transition-colors text-xl">
          ✕
        </button>
      </div>

      <!-- Robot name -->
      <p class="text-text-secondary text-xs tracking-wider uppercase">{{ robotName }}</p>

      <!-- Loading -->
      <div v-if="loading" class="text-text-muted text-sm text-center py-4">
        Loading history...
      </div>

      <!-- Empty -->
      <div v-else-if="history.length === 0" class="text-text-muted text-sm text-center py-4">
        No commands sent yet
      </div>

      <!-- History list -->
      <div v-else class="flex flex-col gap-2">
        <div 
          v-for="(item, index) in history" 
          :key="index"
          class="bg-bg-base rounded-lg p-3 flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <span class="text-accent text-xs font-medium uppercase tracking-wider">{{ item.command }}</span>
            <span class="text-text-muted text-xs">{{ formatTime(item.timestamp) }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-text-secondary">
            <span>{{ item.previous_status }}</span>
            <span class="text-text-muted">→</span>
            <span>{{ item.new_status }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { Command } from '../types'

defineProps<{
  show: boolean
  robotName: string
  history: Command[]
  loading: boolean
}>()

defineEmits<{
  close: []
}>()

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-CA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
</script>