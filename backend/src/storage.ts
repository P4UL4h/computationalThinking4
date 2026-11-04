import { mkdir, readFile, writeFile } from 'node:fs/promises'

export type BoardObject = { id: string; type: string; [key: string]: unknown }

// Only this file knows where and how the board is stored.
const DIR = new URL('../data/', import.meta.url)
const FILE = new URL('board.json', DIR)

// Starting state when no board file exists yet (same examples as the frontend).
const INITIAL: BoardObject[] = [
  { id: 'note-1', type: 'sticky-note', x: 120, y: 120, width: 192, height: 192, text: 'Hello, board!', color: 'yellow', fontSize: 18, bold: false },
  { id: 'note-2', type: 'sticky-note', x: 360, y: 120, width: 192, height: 192, text: 'Drag me around', color: 'pink', fontSize: 18, bold: false },
  { id: 'text-1', type: 'text', x: 600, y: 120, width: 240, height: 72, text: 'Just some text', fontSize: 18, bold: false },
  { id: 'circle-1', type: 'circle', x: 600, y: 240, width: 144, height: 144, color: 'blue' },
]

export async function readObjects(): Promise<BoardObject[]> {
  try {
    return JSON.parse(await readFile(FILE, 'utf8'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    await writeObjects(INITIAL)
    return INITIAL
  }
}

export async function writeObjects(objects: BoardObject[]) {
  await mkdir(DIR, { recursive: true })
  await writeFile(FILE, JSON.stringify(objects, null, 2))
}
