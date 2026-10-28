<script setup lang="ts">
import { Circle, StickyNote as StickyNoteIcon, Type } from '@lucide/vue'
import type { NoteType } from '~/types/note'

const TOOLS = [
  { type: 'note', icon: StickyNoteIcon, label: 'Note' },
  { type: 'text', icon: Type, label: 'Text' },
  { type: 'circle', icon: Circle, label: 'Kreis' },
] as const

const emit = defineEmits<{ add: [type: NoteType] }>()
</script>

<template>
  <div class="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-xl border bg-background p-1.5 shadow-lg">
    <button
      v-for="tool in TOOLS"
      :key="tool.type"
      class="flex size-9 items-center justify-center rounded-lg hover:bg-muted"
      :title="tool.label"
      @click="emit('add', tool.type)"
    >
      <component :is="tool.icon" class="size-5" />
    </button>
  </div>
</template>
