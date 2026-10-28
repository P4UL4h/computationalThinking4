<script setup lang="ts">
import type { NoteColor } from '~/types/note'

defineProps<{ color: NoteColor }>()
const emit = defineEmits<{ select: [color: NoteColor] }>()
</script>

<template>
  <div class="flex items-center gap-1.5">
    <button
      v-for="(classes, option) in NOTE_COLORS"
      :key="option"
      class="size-5 rounded-full border"
      :class="[classes.bg, option === color ? 'ring-2 ring-blue-400 ring-offset-1' : '']"
      :title="option"
      @click="emit('select', option)"
    />
  </div>
</template>
