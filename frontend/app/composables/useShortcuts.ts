import type { Note } from '~/types/note'

// Keyboard shortcuts for the board. The clipboard stays local to this browser.
export function useShortcuts(selectedId: Ref<string | null>, editingId: Ref<string | null>) {
  const board = useBoard()
  let clipboard: Note | null = null

  function selectedNote() {
    return board.notes.value.find((note) => note.id === selectedId.value)
  }

  function deleteNote(id: string) {
    board.deleteNote(id)
    if (selectedId.value === id) selectedId.value = null
    if (editingId.value === id) editingId.value = null
  }

  function paste(note: Note) {
    const copy = copyNote(note)
    board.addNote(copy)
    selectedId.value = copy.id
    return copy
  }

  function onKeyDown(event: KeyboardEvent) {
    const target = event.target
    if (target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement || target instanceof HTMLSelectElement) return
    const note = selectedNote()
    const mod = event.metaKey || event.ctrlKey
    const key = event.key.toLowerCase()

    if (key === 'delete' || key === 'backspace') {
      if (note) deleteNote(note.id)
    } else if (key === 'escape') {
      selectedId.value = null
    } else if (mod && key === 'c') {
      if (note) clipboard = { ...note }
    } else if (mod && key === 'x') {
      if (!note) return
      clipboard = { ...note }
      deleteNote(note.id)
    } else if (mod && key === 'v') {
      // Remember the pasted copy so repeated pastes keep shifting.
      if (clipboard) clipboard = paste(clipboard)
    } else if (mod && key === 'd') {
      if (note) paste(note)
    } else if (mod && key === 'z') {
      if (event.shiftKey) board.redo()
      else board.undo()
    } else {
      return
    }
    event.preventDefault()
  }

  onMounted(() => window.addEventListener('keydown', onKeyDown))
  onUnmounted(() => window.removeEventListener('keydown', onKeyDown))

  return { deleteNote }
}
