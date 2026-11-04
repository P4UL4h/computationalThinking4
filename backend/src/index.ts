import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { objects } from './objects.ts'

const PORT = 3001

const app = new Hono()
app.use(cors({ origin: 'http://localhost:3000' }))
app.route('/objects', objects)

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Backend läuft auf http://localhost:${PORT}`)
})
