<script setup lang="ts">
import { Trash2 } from '@lucide/vue'
import type { Note } from '~/types/note'

// Attribute bar above the selected note; picks the editor for its type.
defineProps<{ note: Note }>()
const emit = defineEmits<{ update: [patch: Partial<Note>]; delete: [] }>()
</script>

<template>
  <div
    class="absolute bottom-full left-1/2 mb-3 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border bg-background px-2 py-1.5 text-foreground shadow-md cursor-default"
    @pointerdown.stop
    @dblclick.stop
  >
    <NoteEditor v-if="note.type === 'note'" :note="note" @update="emit('update', $event)" />
    <CircleEditor v-else-if="note.type === 'circle'" :note="note" @update="emit('update', $event)" />
    <TextEditor v-else :note="note" @update="emit('update', $event)" />
    <div class="h-4 w-px bg-border" />
    <ToolButton title="Löschen" class="hover:text-destructive" @click="emit('delete')">
      <Trash2 class="size-4" />
    </ToolButton>
  </div>
</template>
