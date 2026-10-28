<script setup lang="ts">
import { CircleDashed } from '@lucide/vue'
import type { Note } from '~/types/note'

defineProps<{ note: Note }>()
const emit = defineEmits<{ update: [patch: Partial<Note>] }>()
</script>

<template>
  <ColorPicker :color="note.color" @select="emit('update', { color: $event })" />
  <div class="h-4 w-px bg-border" />
  <ToolButton :active="note.border" title="Rand" @click="emit('update', { border: !note.border })">
    <CircleDashed class="size-4" />
  </ToolButton>
</template>
