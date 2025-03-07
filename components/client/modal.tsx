'use client'
import { FC } from 'react';
import { useModal } from '../context/modalContext';
import { cn } from '@/lib/className';

interface ModalProps {
    children: React.ReactNode,
    className?: string
}


const Modal: FC<ModalProps> = ({ children, className }) => {
    const { modalState, modalSetter } = useModal()
    return <div className={`fixed inset-0 w-full h-screen z-[999] bg-black/30 backdrop-blur-md flex items-center justify-center ${!modalState.isOpen && 'hidden'}`} onClick={() => modalSetter('state', !modalState.isOpen)} style={{ marginTop: '0px' }}>
        <div className={cn('min-w-[400px] h-fit bg-white border rounded-md p-5 m-0 ', className)} onClick={(e) => e.stopPropagation()}>
            {children}
        </div>
    </div>;
}

export default Modal;