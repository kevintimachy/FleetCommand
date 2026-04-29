<template>
  <nav class="bg-bg-nav border-b border-border px-8 py-4 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <span class="text-xl font-bold text-accent tracking-widest uppercase">
        ⚡ FleetCommand
      </span>
      <span class="text-text-muted text-xs tracking-wider uppercase">
        Mission Control
      </span>
    </div>

    <div class="flex items-center gap-2">
      <div 
        :class="isConnected ? 'bg-status-idle shadow-[0_0_8px_#00b894]' : 'bg-status-error'" 
        class="w-2 h-2 rounded-full transition-all duration-300">
      </div>
      <span 
        class="text-xs tracking-wider uppercase"
        :class="isConnected ? 'text-status-idle' : 'text-status-error'">
        {{ isConnected ? 'Live' : 'Disconnected' }}
      </span>
    </div>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  isConnected: boolean
}>()
</script>