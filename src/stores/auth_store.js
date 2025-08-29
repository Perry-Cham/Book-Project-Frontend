import {create} from 'zustand'
const useAuthStore = create((set) => ({
  user:{name:"", isLoggedIn:""},
  setUser: (user2) => set((state) => ({...state, user:user2}))
}))

export default useAuthStore;