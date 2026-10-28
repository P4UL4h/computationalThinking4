export type NoteType = 'note' | 'text' | 'circle'
export type NoteColor = 'yellow' | 'pink' | 'blue' | 'green' | 'gray'
export type NoteAlign = 'left' | 'center' | 'right'

export interface Note {
  id: string
  type: NoteType
  color: NoteColor
  x: number
  y: number
  width: number
  height: number
  text: string
  fontSize: number
  bold: boolean
  italic: boolean
  underline: boolean
  strike: boolean
  align: NoteAlign
  border: boolean
}
