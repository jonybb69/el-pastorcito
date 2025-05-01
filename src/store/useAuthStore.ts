import { create } from 'zustand'

interface AuthState {
  user: { email: string } | null
  token: string | null
  login: (user: { email: string }, token: string) => void
  logout: () => void
  setToken: (token: string) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => {
    set({ user: null, token: null })
    document.cookie = 'auth-token=; Max-Age=0; path=/'
  },
  setToken: (token) => set((state) => ({ ...state, token })),
}))
