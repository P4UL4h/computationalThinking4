import type { Context } from 'hono'
import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import type { User } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { saveProfile } from './storage.js'

const FRONTEND_URL = 'http://localhost:3000'
const CALLBACK_URL = 'http://localhost:3001/auth/callback'

// One Supabase client per request that keeps the session in cookies only the backend can read and write.
// The browser just sends the cookies along; it never talks to Supabase itself.
function supabaseFor(c: Context) {
  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    cookieOptions: { httpOnly: true, sameSite: 'lax', path: '/' },
    cookies: {
      getAll: () => Object.entries(getCookie(c)).map(([name, value]) => ({ name, value })),
      setAll: cookies => cookies.forEach(({ name, value, options }) => setCookie(c, name, value, options as never)),
    },
  })
}

// The parts of the Google account the app uses.
function toProfile(user: User) {
  const { full_name, name, avatar_url } = user.user_metadata
  return { id: user.id, email: user.email!, name: full_name ?? name ?? user.email!, avatarUrl: avatar_url }
}

// The logged-in user from the session cookies, or null. Routes that need a login call this themselves.
export async function currentUser(c: Context) {
  const { data } = await supabaseFor(c).auth.getUser()
  return data.user ? toProfile(data.user) : null
}

// Login, callback, current user and logout for "Mit Google anmelden".
export const auth = new Hono()

auth.get('/login', async (c) => {
  const { data, error } = await supabaseFor(c).auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: CALLBACK_URL, skipBrowserRedirect: true },
  })
  if (error) return c.json({ error: error.message }, 500)
  return c.redirect(data.url)
})

// Google sends the user back here with a one-time code, which is exchanged for the session cookies.
auth.get('/callback', async (c) => {
  const code = c.req.query('code')
  if (code) {
    const { data } = await supabaseFor(c).auth.exchangeCodeForSession(code)
    // Saved so others can find this user by email and see their name and avatar on shared boards.
    if (data.user) await saveProfile(toProfile(data.user))
  }
  return c.redirect(FRONTEND_URL)
})

auth.get('/me', async (c) => {
  const user = await currentUser(c)
  if (!user) return c.json({ error: 'Not logged in' }, 401)
  return c.json(user)
})

auth.post('/logout', async (c) => {
  await supabaseFor(c).auth.signOut()
  return c.body(null, 204)
})
