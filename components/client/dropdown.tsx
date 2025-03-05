'use client'
import { cn } from '@/lib/className';
import { DropdownContainerOutput } from '@/types/context';
import { Ellipsis } from 'lucide-react';
import React, { createContext, FC, HTMLAttributes, ReactElement, useContext, useState } from 'react';

const DropdownContainerContext = createContext<DropdownContainerOutput>(undefined)

interface DropdownSettingsProps {
    children: React.ReactNode,
    className?: string
}

export const DropdownSettings: FC<DropdownSettingsProps> = ({ children, className }) => {
    const iconSize = 17;
    const iconColor = '#64748b'
    const [isOpen, setIsOpen] = useState(false)
    function handleDropdown() {
        setIsOpen(prev => !prev)
    }
    return <span className={cn('flex items-center relative flex-col', className)}>
        <Ellipsis size={iconSize} color={iconColor} className='cursor-pointer' onClick={() => setIsOpen(prev => !prev)} />
        <div className={`w-[100px] ${!isOpen && 'hidden'} overflow-y-auto bg-white absolute top-10 right-0 rounded-sm border z-[100]`}>
            <DropdownContainerContext.Provider value={{ isOpen, handleDropdown }}>
                {children}
            </DropdownContainerContext.Provider>
        </div>
    </span>
}

interface DropdownContainerProps {
    appereance: React.ReactElement<HTMLAttributes<HTMLDivElement>>,
    children: React.ReactNode,
    disabled?: boolean,
    itemStyle?: 'full' | 'default',
    className?: string
}

export const DropdownContainer: FC<DropdownContainerProps> = ({ appereance, children, className, itemStyle = 'default', disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false)
    function handleDropdown() {
        setIsOpen(prev => !prev)
    }
    return <span className={cn('flex items-center relative flex-col', className)}>
        {disabled ? React.cloneElement(appereance, { className: cn(appereance.props.className, 'bg-zinc-100 cursor-not-allowed') }) : React.cloneElement(appereance, { onClick: () => handleDropdown() })}
        {
            !disabled &&
            <div className={`${itemStyle == 'full' ? 'w-full' : 'w-[100px]'} ${!isOpen && 'hidden'} overflow-y-auto bg-white absolute top-10  right-0 rounded-sm border z-[100] max-h-[200px] scrollbar-thin`}>
                <DropdownContainerContext.Provider value={{ isOpen, handleDropdown }}>
                    {children}
                </DropdownContainerContext.Provider>
            </div>
        }
    </span>
}

export function useDropdownContainer() {
    try {
        const context = useContext(DropdownContainerContext)
        return context;
    } catch (error) {
        console.error(error)
    }
}


interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
    children: string,
    icon?: React.ReactNode,
    className?: string,
    onClickCallback?: () => void
}

export const DropdownItem: FC<DropdownItemProps> = ({ children, icon, onClickCallback, className, ...props }) => {
    const iconModifed = icon && React.cloneElement(icon, { size: 15, className: 'mr-2' })
    const { handleDropdown } = useDropdownContainer()
    function onClickHandler() {
        handleDropdown()
        if (onClickCallback) {
            onClickCallback()
        }
    }
    return <div className={cn('w-full h-[35px] flex items-center space-x-2 px-3 transition-300  bg-white cursor-pointer hover:bg-zinc-100', className)} {...props} onClick={() => onClickHandler()}>
        {iconModifed} {children}
    </div>;
}

