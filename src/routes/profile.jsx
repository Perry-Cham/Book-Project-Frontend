import axios from "axios"
import { useState } from "react"
import { Dialog } from '@headlessui/react'
function Profile_Page() {
    const api = import.meta.env.VITE_API
    const [modalState, setModalState] = useState({ open: false, message: "", title: "" })
    async function handleDeleteAccount() {
        try {
            const response = await axios.delete(`${api}/deleteuser`, { withCredentials: true })
            if (response.status === 200) setModalState(prev => ({ ...prev, message: "Your account has been deleted", title: "Success" })); else setModalState(prev => ({ ...prev, message: "We encountered an error, try again later", title: "Error" }))
        } catch (error) {
            console.error(error)
            setModalState(prev => ({ ...prev, message: "We encountered an error, try again later", title: "Error" }))
        }
    }
    return (
        <section>
            <header>My Profile
                <div>Placeholder Img</div>
                <h1>Welcome User!</h1>
            </header>
            <main>
                <ul>
                    <li onClick={() => handleDeleteAccount()}>Delete Account</li>
                    <li>Toggle Syncing</li>
                    <li>View Books On Account</li>
                </ul>

            </main>
            <Dialog open={modalState.open} onClose={() => setModalState(prev => ({ ...prev, open: false }))} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto max-w-4xl rounded bg-white p-6">
                        <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
                            {modalState.heading}
                        </Dialog.Title>
                        <Dialog.Description>
                            <p>{modalState.message}</p>
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