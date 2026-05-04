<template>
  <nav class="bg-bg-nav border-b border-border px-8 py-4 flex items-center justify-between">
    <Logo />
    <div class="flex items-center gap-2">
      <div
        :class="isConnected ? 'bg-accent shadow-[0_0_6px_#00ff9d]' : 'bg-status-error'"
        class="w-1.5 h-1.5 rounded-full transition-all duration-300">
      </div>
      <span
        class="text-xs tracking-[0.12em] uppercase"
        :class="isConnected ? 'text-accent' : 'text-status-error'">
        {{ isConnected ? 'Online' : 'Offline' }}
      </span>
    </div>
  </nav>
</template>

<script setup lang="ts">
import Logo from './Logo.vue'

defineProps<{
  isConnected: boolean
}>()
</script>