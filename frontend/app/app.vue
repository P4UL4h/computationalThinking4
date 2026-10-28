<script setup lang="ts">
import type { NoteType } from '~/types/note'

const board = useBoard()

// Local view state, not shared with others.
const canvas = useTemplateRef('canvas')
const selectedId = ref<string | null>(null)
const editingId = ref<string | null>(null)

const { deleteNote } = useShortcuts(selectedId, editingId)

function addNote(type: NoteType) {
  const note = createNote(type, canvas.value!.viewCenter())
  board.addNote(note)
  selectedId.value = note.id
}

function startEditing(id: string) {
  board.checkpoint()
  editingId.value = id
}
</script>

<template>
  <InfiniteCanvas ref="canvas" @pointerdown="selectedId = null">
    <StickyNote
      v-for="note in board.notes.value"
      :key="note.id"
      :note="note"
      :selected="note.id === selectedId"
      :editing="note.id === editingId"
      @select="selectedId = note.id"
      @change-start="board.checkpoint()"
      @update="board.updateNote(note.id, $event)"
      @delete="deleteNote(note.id)"
      @start-editing="startEditing(note.id)"
      @stop-editing="editingId = null"
    />
  </InfiniteCanvas>
  <BoardToolbar @add="addNote" />
</template>
