import {create} from 'zustand'
import {persist} from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: {name: "", isLoggedIn: ""},
      setUser: (user2) => set((state) => ({...state, user: user2}))
    }),
    {
      name: 'auth-store',
      storage: localStorage
    }
  )
)

export default useAuthStore;