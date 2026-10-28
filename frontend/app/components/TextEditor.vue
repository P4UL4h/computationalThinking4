<script setup lang="ts">
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Strikethrough, Underline } from '@lucide/vue'
import type { Note } from '~/types/note'

const FORMATS = [
  { key: 'bold', icon: Bold, label: 'Fett' },
  { key: 'italic', icon: Italic, label: 'Kursiv' },
  { key: 'underline', icon: Underline, label: 'Unterstrichen' },
  { key: 'strike', icon: Strikethrough, label: 'Durchgestrichen' },
] as const
const ALIGNS = [
  { key: 'left', icon: AlignLeft, label: 'Links' },
  { key: 'center', icon: AlignCenter, label: 'Mitte' },
  { key: 'right', icon: AlignRight, label: 'Rechts' },
] as const

defineProps<{ note: Note }>()
const emit = defineEmits<{ update: [patch: Partial<Note>] }>()
</script>

<template>
  <select
    class="h-6 rounded-md bg-transparent px-1 text-sm hover:bg-muted"
    title="Schriftgröße"
    :value="note.fontSize"
    @change="emit('update', { fontSize: Number(($event.target as HTMLSelectElement).value) })"
  >
    <option v-for="size in FONT_SIZES" :key="size" :value="size">{{ size }}</option>
  </select>
  <div class="h-4 w-px bg-border" />
  <ToolButton
    v-for="format in FORMATS"
    :key="format.key"
    :active="note[format.key]"
    :title="format.label"
    @click="emit('update', { [format.key]: !note[format.key] } as Partial<Note>)"
  >
    <component :is="format.icon" class="size-4" />
  </ToolButton>
  <div class="h-4 w-px bg-border" />
  <ToolButton
    v-for="align in ALIGNS"
    :key="align.key"
    :active="note.align === align.key"
    :title="align.label"
    @click="emit('update', { align: align.key })"
  >
    <component :is="align.icon" class="size-4" />
  </ToolButton>
</template>
