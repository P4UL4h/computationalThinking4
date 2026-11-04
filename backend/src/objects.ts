import { Hono } from 'hono'
import type { Context } from 'hono'
import { readObjects, writeObjects } from './storage.ts'
import type { BoardObject } from './storage.ts'

// Returns the JSON body if it is a plain object, otherwise null.
async function readBody(c: Context): Promise<Record<string, unknown> | null> {
  try {
    const body = await c.req.json()
    return body && typeof body === 'object' && !Array.isArray(body) ? body : null
  } catch {
    return null
  }
}

export const objects = new Hono()

objects.get('/', async c => c.json(await readObjects(), 200))

objects.post('/', async c => {
  const body = await readBody(c)
  if (!body || typeof body.type !== 'string') return c.json({ error: 'Body must be an object with a string "type"' }, 400)

  const object: BoardObject = { ...body, id: typeof body.id === 'string' ? body.id : crypto.randomUUID(), type: body.type }
  await writeObjects([...(await readObjects()), object])
  return c.json(object, 201)
})

objects.patch('/:id', async c => {
  const body = await readBody(c)
  if (!body) return c.json({ error: 'Body must be an object' }, 400)

  const id = c.req.param('id')
  const all = await readObjects()
  const existing = all.find(object => object.id === id)
  if (!existing) return c.json({ error: 'Object not found' }, 404)

  const updated: BoardObject = { ...existing, ...body, id }
  await writeObjects(all.map(object => (object.id === id ? updated : object)))
  return c.json(updated, 200)
})

objects.delete('/:id', async c => {
  const id = c.req.param('id')
  const all = await readObjects()
  if (!all.some(object => object.id === id)) return c.json({ error: 'Object not found' }, 404)

  await writeObjects(all.filter(object => object.id !== id))
  return c.body(null, 204)
})
