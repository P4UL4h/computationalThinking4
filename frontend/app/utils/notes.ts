import type { Note, NoteType } from '~/types/note'

const DEFAULT_SIZE = 192
export const TEXT_SIZES = { S: 14, M: 18, L: 28 } as const
export const FONT_SIZES = [14, 18, 24, 32, 48]

// New note with all defaults, centered on the given board point.
export function createNote(type: NoteType, center: { x: number; y: number }): Note {
  const width = DEFAULT_SIZE
  const height = type === 'text' ? GRID_SIZE * 3 : DEFAULT_SIZE
  return {
    id: crypto.randomUUID(),
    type,
    color: 'yellow',
    x: snapToGrid(center.x - width / 2),
    y: snapToGrid(center.y - height / 2),
    width,
    height,
    text: type === 'text' ? 'Text' : '',
    fontSize: TEXT_SIZES.M,
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    align: type === 'circle' ? 'center' : 'left',
    border: false,
  }
}

// Copy with a new id, shifted by one grid cell.
export function copyNote(note: Note): Note {
  return { ...note, id: crypto.randomUUID(), x: note.x + GRID_SIZE, y: note.y + GRID_SIZE }
}
