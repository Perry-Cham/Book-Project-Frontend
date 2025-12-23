import { useState } from "react"
import { Dialog } from '@headlessui/react'
import api from '../utilities/api'
import { deleteDB } from "idb"
import useAuthStore from "../stores/auth_store"
function Profile_Page() {
    const [modalState, setModalState] = useState({ open: false, message: "", title: "" })
    const {user} = useAuthStore()
    async function handleDeleteAccount() {
        try {
            const response = await api.delete(`/deleteuser`)
            if (response.status === 200){
                setModalState(prev => ({ ...prev, message: "Your account has been deleted", title: "Success" }));
                await deleteDB('App',1)
                localStorage.clear()
                const root = await navigator.storage.getDirectory()
                await root.remove({recursive: true})
         }else setModalState(prev => ({ ...prev, message: "We encountered an error, try again later", title: "Error" }))
        } catch (error) {
            console.error(error)
            setModalState(prev => ({ ...prev, message: "We encountered an error, try again later", title: "Error" }))
        }
    }
    return (
        <section className="w-full flex flex-col bg-theme">
            <div className="m-auto max-w-[1024px] rounded-lg">
                <div className="grid grid-cols-2 gap-3 mb-3 p-4 bg-white rounded-lg">
                    <div className="w-[150px] h-[150px] rounded-[50%] border-2 flex items-center justify-center">Placeholder Img</div>
                    <div className="p-4">
                    <h1 className="text-lg font-bold">My Profile</h1>
                    <h2>{user.name}</h2>
                    </div>
                </div>

                <div className="mt-3 bg-white rounded-lg">
                    <ul>
                        <li className="profile-link" onClick={() => handleDeleteAccount()}>Delete Account</li>
                        <li className="profile-link">Toggle Syncing</li>
                        <li className="profile-link">View Books On Account</li>
                    </ul>

                </div>
            </div>
            
            <Dialog open={modalState.open} onClose={() => setModalState(prev => ({ ...prev, open: false }))} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto max-w-4xl rounded bg-white p-6">
                        <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
                            {modalState.heading}
                        </Dialog.Title>
                        <Dialog.Description>
                            {modalState.message}
                        </Dialog.Description>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setModalState((prev) => ({ ...prev, open: false }))}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
                            >
                                Close
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </section>
    )
}
export default Profile_Page;