'use client'
import { cn } from '@/lib/className';
import { Ellipsis } from 'lucide-react';
import React, { FC, HTMLAttributes, ReactElement, useState } from 'react';

interface DropdownSettingsProps {
    children: React.ReactNode
}

export const DropdownSettings: FC<DropdownSettingsProps> = ({ children }) => {
    const iconSize = 17;
    const iconColor = '#64748b'
    const [isOpen, setIsOpen] = useState(false)
    return <span className='flex items-center relative flex-col'>
        <Ellipsis size={iconSize} color={iconColor} className='cursor-pointer' onClick={() => setIsOpen(prev => !prev)} />
        <div className={`w-[100px] ${!isOpen && 'hidden'} overflow-y-auto bg-white absolute top-10 right-0 rounded-sm border z-[100]`}>
            {children}
        </div>
    </span>
}

interface DropdownContainerProps {
    appereance: React.ReactElement<HTMLAttributes<HTMLDivElement>>,
    children: React.ReactNode,
    className?: string
}

export const DropdownContainer: FC<DropdownContainerProps> = ({ appereance, children, className }) => {
    const [isOpen, setIsOpen] = useState(false)
    return <span className={cn('flex items-center relative flex-col', className)}>
        {React.cloneElement(appereance, { onClick: () => setIsOpen(prev => !prev) })}
        <div className={`w-[100px] ${!isOpen && 'hidden'} overflow-y-auto bg-white absolute top-10 right-0 rounded-sm border z-[100]`}>
            {children}
        </div>
    </span>
}




interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
    children: string,
    icon?: React.ReactNode
}

export const DropdownItem: FC<DropdownItemProps> = ({ children, icon, ...props }) => {
    const iconModifed = icon && React.cloneElement(icon, { size: 15, className: 'mr-2' })
    return <div className='w-full h-[35px] flex items-center space-x-2 px-3 transition-300  bg-white cursor-pointer hover:bg-zinc-50' {...props}>
        {iconModifed} {children}
    </div>;
}
