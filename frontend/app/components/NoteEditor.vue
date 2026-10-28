<script setup lang="ts">
import type { Note } from '~/types/note'

defineProps<{ note: Note }>()
const emit = defineEmits<{ update: [patch: Partial<Note>] }>()
</script>

<template>
  <ToolButton
    v-for="(size, label) in TEXT_SIZES"
    :key="label"
    :active="note.fontSize === size"
    :title="`Textgröße ${label}`"
    @click="emit('update', { fontSize: size })"
  >
    {{ label }}
  </ToolButton>
  <div class="h-4 w-px bg-border" />
  <ColorPicker :color="note.color" @select="emit('update', { color: $event })" />
</template>
