import type { BoardObject, ObjectTemplate, Rect, StyleChanges, TextObject } from '~/types/canvas-object'

const API = 'http://localhost:3001/objects'
const PATCH_DELAY = 300

const TEXT_DEFAULTS = { text: '', fontSize: FONT_SIZES.M, bold: false }

// Starting attributes of a new object, per variant. Only variants with text get text attributes.
const DEFAULTS: Record<BoardObject['type'], Rect & Partial<TextObject>> = {
  'sticky-note': { x: 0, y: 0, width: GRID_SIZE * 8, height: GRID_SIZE * 8, ...TEXT_DEFAULTS },
  'text': { x: 0, y: 0, width: GRID_SIZE * 10, height: GRID_SIZE * 3, ...TEXT_DEFAULTS },
  'circle': { x: 0, y: 0, width: GRID_SIZE * 6, height: GRID_SIZE * 6 },
}

type Changes = Partial<Rect> & StyleChanges & { text?: string }

// Gesture changes collected per object until the pointer pauses (shared by every useBoard() call).
const pending = new Map<string, { changes: Changes; timer: ReturnType<typeof setTimeout> }>()

function patchNow(id: string, changes: Changes) {
  $fetch(`${API}/${id}`, { method: 'PATCH', body: changes })
}

// Merges the changes into what is already collected and sends them once nothing changed for PATCH_DELAY.
function patchLater(id: string, changes: Changes) {
  const entry = pending.get(id)
  if (entry) clearTimeout(entry.timer)
  const merged = { ...entry?.changes, ...changes }
  const timer = setTimeout(() => {
    pending.delete(id)
    patchNow(id, merged)
  }, PATCH_DELAY)
  pending.set(id, { changes: merged, timer })
}

// The board state is the single source of truth for which objects exist and what they look like.
// Components only read it; every change goes through one of the functions below.
// Each function changes the local state first and then tells the backend.
export function useBoard() {
  const objects = useState<BoardObject[]>('objects', () => [])
  const loaded = useState('objects-loaded', () => false)

  if (import.meta.client && !loaded.value) {
    loaded.value = true
    $fetch<BoardObject[]>(API).then(data => (objects.value = data))
  }

  function create(object: BoardObject) {
    objects.value = [...objects.value, object]
    $fetch(API, { method: 'POST', body: object })
    return object.id
  }

  function addObject(template: ObjectTemplate, centerX: number, centerY: number) {
    const defaults = DEFAULTS[template.type]
    const id = crypto.randomUUID()
    const x = snapToGrid(centerX - defaults.width / 2)
    const y = snapToGrid(centerY - defaults.height / 2)
    return create({ ...defaults, ...template, id, x, y } as BoardObject)
  }

  // Works for every variant: the copy keeps all attributes except the id.
  function addCopy(source: BoardObject) {
    return create({ ...source, id: crypto.randomUUID() })
  }

  function removeObject(id: string) {
    objects.value = objects.value.filter(object => object.id !== id)
    clearTimeout(pending.get(id)?.timer)
    pending.delete(id)
    $fetch(`${API}/${id}`, { method: 'DELETE' })
  }

  function updateObject(id: string, changes: Changes) {
    objects.value = objects.value.map(object => (object.id === id ? ({ ...object, ...changes } as BoardObject) : object))
  }

  function moveObject(id: string, x: number, y: number) {
    updateObject(id, { x, y })
    patchLater(id, { x, y })
  }

  function resizeObject(id: string, rect: Rect) {
    updateObject(id, rect)
    patchLater(id, rect)
  }

  function updateText(id: string, text: string) {
    updateObject(id, { text })
    patchNow(id, { text })
  }

  function updateStyle(id: string, changes: StyleChanges) {
    updateObject(id, changes)
    patchNow(id, changes)
  }

  return { objects: readonly(objects), addObject, addCopy, removeObject, moveObject, resizeObject, updateText, updateStyle }
}
