import type { NoteColor } from '~/types/note'

// Full class names so Tailwind picks them up.
export const NOTE_COLORS: Record<NoteColor, { bg: string; text: string; border: string }> = {
  yellow: { bg: 'bg-yellow-200', text: 'text-yellow-700', border: 'border-yellow-500' },
  pink: { bg: 'bg-pink-200', text: 'text-pink-700', border: 'border-pink-500' },
  blue: { bg: 'bg-sky-200', text: 'text-sky-700', border: 'border-sky-500' },
  green: { bg: 'bg-green-200', text: 'text-green-700', border: 'border-green-500' },
  gray: { bg: 'bg-neutral-200', text: 'text-neutral-700', border: 'border-neutral-500' },
}
