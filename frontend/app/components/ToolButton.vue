<script setup lang="ts">
defineProps<{ active?: boolean }>()
</script>

<template>
  <button
    class="flex h-6 min-w-6 items-center justify-center rounded-md px-1 text-sm hover:bg-muted"
    :class="active ? 'bg-muted text-foreground' : 'text-muted-foreground'"
  >
    <slot />
  </button>
</template>
