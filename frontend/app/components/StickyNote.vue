<script setup lang="ts">
const props = defineProps<{ x: number; y: number; scale: number; grid: number }>()
const emit = defineEmits<{ delete: [] }>()

const MIN_SIZE = 96
const snap = (v: number) => Math.round(v / props.grid) * props.grid

const pos = reactive({ x: snap(props.x), y: snap(props.y) })
const size = reactive({ w: 240, h: 168 })
const text = ref('Neue Notiz')
const editing = ref(false)
const textarea = ref<HTMLTextAreaElement>()
let drag: { x: number; y: number; originX: number; originY: number } | null = null
let resize: { x: number; y: number; originW: number; originH: number } | null = null

function onPointerDown(e: PointerEvent) {
  if (editing.value) return
  drag = { x: e.clientX, y: e.clientY, originX: pos.x, originY: pos.y }
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!drag) return
  // Screen pixels → canvas pixels, then lock to the grid
  pos.x = snap(drag.originX + (e.clientX - drag.x) / props.scale)
  pos.y = snap(drag.originY + (e.clientY - drag.y) / props.scale)
}

function onResizeDown(e: PointerEvent) {
  resize = { x: e.clientX, y: e.clientY, originW: size.w, originH: size.h }
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onResizeMove(e: PointerEvent) {
  if (!resize) return
  size.w = Math.max(MIN_SIZE, snap(resize.originW + (e.clientX - resize.x) / props.scale))
  size.h = Math.max(MIN_SIZE, snap(resize.originH + (e.clientY - resize.y) / props.scale))
}

async function startEditing() {
  editing.value = true
  await nextTick()
  textarea.value?.focus()
}
</script>

<template>
  <div
    class="absolute select-none"
    :class="editing ? 'cursor-text' : 'cursor-grab'"
    :style="{ transform: `translate(${pos.x}px, ${pos.y}px)`, width: `${size.w}px`, height: `${size.h}px` }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="drag = null"
    @dblclick="startEditing"
  >
    <CowShape />
    <!-- Sits on the cow's belly spot (percentages match CowShape's viewBox) -->
    <div class="absolute left-[41%] top-[36%] h-[30%] w-[40%] text-sm text-white">
      <textarea
        v-if="editing"
        ref="textarea"
        v-model="text"
        class="h-full w-full resize-none bg-transparent outline-none"
        @blur="editing = false"
      />
      <p v-else class="h-full overflow-hidden whitespace-pre-wrap break-words">{{ text }}</p>
    </div>
    <button
      class="absolute right-1 top-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded text-neutral-700 hover:bg-neutral-200"
      title="Post-it löschen"
      @pointerdown.stop
      @click="emit('delete')"
      @dblclick.stop
    >
      ×
    </button>
    <div
      class="absolute bottom-1 right-1 h-3 w-3 cursor-nwse-resize border-b-2 border-r-2 border-neutral-700"
      @pointerdown.stop="onResizeDown"
      @pointermove="onResizeMove"
      @pointerup="resize = null"
      @dblclick.stop
    />
  </div>
</template>
