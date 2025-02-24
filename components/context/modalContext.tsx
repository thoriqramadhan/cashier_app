'use client'

import React, { createContext, useContext, useState, FC } from "react"
import { modalOptionArguments, modalOutput } from "@/types/context";


const ModalContext = createContext<modalOutput>(undefined)


interface ModalContextProviderProps {
    children: React.ReactNode
}

export const ModalContextProvider: FC<ModalContextProviderProps> = ({ children }) => {
    const stateInit = {
        isOpen: false,
    }
    const [modalState, setModalState] = useState(stateInit)
    function handleModal(option: modalOptionArguments, value: boolean) {

        setModalState(prev => (
            {
                isOpen: option == 'state' ? value : prev.isOpen
            }
        ))
    }
    return <ModalContext.Provider value={{ modalState: modalState, modalSetter: handleModal }}>
        {children}
    </ModalContext.Provider>
}

export function useModal() {
    const context = useContext(ModalContext)
    return context;
}
