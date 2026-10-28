import type { Note } from '~/types/note'

// Shared board state: the single source of truth for all notes.
// Components only read it and change it through the actions below.
export function useBoard() {
  const notes = useState<Note[]>('board-notes', () => [
    { ...createNote('note', { x: 216, y: 216 }), text: 'Hello, board!' },
  ])
  const past = useState<Note[][]>('board-past', () => [])
  const future = useState<Note[][]>('board-future', () => [])
  const pending = useState<Note[] | null>('board-pending', () => null)

  // Marks the start of a change; it becomes an undo step once something actually changes.
  function checkpoint() {
    pending.value = notes.value
  }

  function commit(next: Note[]) {
    if (pending.value) {
      past.value = [...past.value, pending.value]
      future.value = []
      pending.value = null
    }
    notes.value = next
  }

  function addNote(note: Note) {
    checkpoint()
    commit([...notes.value, note])
  }

  function updateNote(id: string, patch: Partial<Note>) {
    const note = notes.value.find((note) => note.id === id)
    const changed = note && Object.entries(patch).some(([key, value]) => note[key as keyof Note] !== value)
    if (!changed) return
    commit(notes.value.map((note) => (note.id === id ? { ...note, ...patch } : note)))
  }

  function deleteNote(id: string) {
    checkpoint()
    commit(notes.value.filter((note) => note.id !== id))
  }

  function undo() {
    const previous = past.value.at(-1)
    if (!previous) return
    future.value = [notes.value, ...future.value]
    past.value = past.value.slice(0, -1)
    pending.value = null
    notes.value = previous
  }

  function redo() {
    const next = future.value[0]
    if (!next) return
    past.value = [...past.value, notes.value]
    future.value = future.value.slice(1)
    pending.value = null
    notes.value = next
  }

  return { notes: readonly(notes), addNote, updateNote, deleteNote, checkpoint, undo, redo }
}
