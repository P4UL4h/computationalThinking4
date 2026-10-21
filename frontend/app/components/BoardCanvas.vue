<script setup lang="ts">
const GRID = 24

const offset = reactive({ x: 0, y: 0 })
const scale = ref(1)
let panStart: { x: number; y: number } | null = null

let nextId = 1
const notes = ref([{ id: 0, x: 96, y: 96 }])

function addNote() {
  // Place the new note in the middle of the visible area
  notes.value.push({
    id: nextId++,
    x: (window.innerWidth / 2 - offset.x) / scale.value - 96,
    y: (window.innerHeight / 2 - offset.y) / scale.value - 96
  })
}

function deleteNote(id: number) {
  notes.value = notes.value.filter((note) => note.id !== id)
}

function onPointerDown(e: PointerEvent) {
  // Only pan when the empty background is grabbed, not a note
  if (e.target !== e.currentTarget) return
  panStart = { x: e.clientX - offset.x, y: e.clientY - offset.y }
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!panStart) return
  offset.x = e.clientX - panStart.x
  offset.y = e.clientY - panStart.y
}

function onWheel(e: WheelEvent) {
  // Cap each step so fast wheels don't jump too far
  const delta = Math.min(100, Math.max(-100, e.deltaY))
  const newScale = Math.min(5, Math.max(0.1, scale.value * Math.exp(-delta * 0.0025)))
  // Zoom towards the cursor
  const ratio = newScale / scale.value
  offset.x = e.clientX - (e.clientX - offset.x) * ratio
  offset.y = e.clientY - (e.clientY - offset.y) * ratio
  scale.value = newScale
}

const backgroundStyle = computed(() => {
  const size = GRID * scale.value
  return {
    backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
    backgroundSize: `${size}px ${size}px`,
    backgroundPosition: `${offset.x - size / 2}px ${offset.y - size / 2}px`
  }
})
</script>

<template>
  <div
    class="fixed inset-0 touch-none overflow-hidden bg-neutral-50"
    :class="panStart ? 'cursor-grabbing' : 'cursor-default'"
    :style="backgroundStyle"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="panStart = null"
    @wheel.prevent="onWheel"
  >
    <div
      class="absolute left-0 top-0 origin-top-left"
      :style="{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }"
    >
      <StickyNote
        v-for="note in notes"
        :key="note.id"
        :x="note.x"
        :y="note.y"
        :scale="scale"
        :grid="GRID"
        @delete="deleteNote(note.id)"
      />
    </div>
    <button
      class="absolute left-4 top-4 cursor-pointer rounded bg-white px-4 py-2 font-medium shadow-md hover:bg-neutral-100"
      @click="addNote"
    >
      + Post-it
    </button>
  </div>
</template>
