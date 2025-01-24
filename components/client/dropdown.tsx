'use client'
import { Ellipsis } from 'lucide-react';
import { FC, useState } from 'react';

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
            <DropdownSettingsItem />
        </div>
    </span>
}


interface DropdownSettingsItemProps {
}

export const DropdownSettingsItem: FC<DropdownSettingsItemProps> = ({ }) => {
    return <div className='w-full h-[35px] flex items-center px-3 transition-300  bg-white cursor-pointer hover:bg-zinc-50'>
        test
    </div>;
}
