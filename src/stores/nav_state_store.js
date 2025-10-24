import {create} from 'zustand'
const useNavStore = create((set) => ({
    isOpen:true,
    setIsOpen: (state) => set(() => ({isOpen:state}))
}))
export default useNavStore