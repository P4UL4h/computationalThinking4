export type User = { id: string, email: string, name: string, avatarUrl?: string }

// Who is logged in. The backend keeps the session in cookies; the browser only sends them along.
export function useAuth() {
  const apiBase = useRuntimeConfig().public.apiBase
  const api = $fetch.create({ baseURL: apiBase, credentials: 'include' })
  const user = useState<User | null>('user', () => null)

  async function load() {
    try {
      user.value = await api<User>('/auth/me')
    }
    catch {
      user.value = null
    }
  }

  // A full page navigation, because the backend redirects on to Google and back.
  function login() {
    window.location.href = `${apiBase}/auth/login`
  }

  async function logout() {
    await api('/auth/logout', { method: 'POST' })
    user.value = null
  }

  return { user: readonly(user), load, login, logout }
}
