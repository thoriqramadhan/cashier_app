'use client'
import { FC } from 'react';
import { useModal } from '../context/modalContext';

interface ModalProps {
    children: React.ReactNode
}

const Modal: FC<ModalProps> = ({ children }) => {
    const { modalState, modalSetter } = useModal()
    return <div className={`fixed top-0 left-0 w-full h-screen bg-black/30 backdrop-blur-md flex items-center justify-center ${!modalState.isOpen && 'hidden'}`} onClick={() => modalSetter('state', !modalState.isOpen)}>
        <div className="min-w-[400px] h-fit bg-white border rounded-md p-5 " onClick={(e) => e.stopPropagation()}>
            {children}
        </div>
    </div>;
}

export default Modal;