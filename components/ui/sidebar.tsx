'use client'
import { BaggageClaim, Clock, House } from 'lucide-react';
import React, { cloneElement, FC } from 'react';
import { useSidebar } from '../context/sidebarContext';
import Link from 'next/link';
import { pathOption } from '@/types/sidebar';

interface SidebarProps {

}

const Sidebar: FC<SidebarProps> = ({ }) => {
    const { state, setter } = useSidebar();
    const sidebarOption = [
        {
            name: 'home',
            icon: <House />
        },
        {
            name: 'orders',
            icon: <BaggageClaim />
        },
        {
            name: 'history',
            icon: <Clock />
        }
    ]
    return <div className={`h-screen bg-white shadow-lg border-r transition-300 flex flex-col items-center gap-y-5 ${state.sidebarStatus ? 'w-[150px] px-3 py-6' : 'w-0 opacity-0'}`}>
        {
            sidebarOption.map((item, index) => (
                <SidebarItem key={index} sidebarValue={item} pathNow={state.sidebarPath} />
            ))
        }
    </div>
}


type sidebarValue = {
    name: string,
    icon: React.ReactNode
}
interface SidebarItemProps {
    sidebarValue: sidebarValue,
    pathNow: string
}

const SidebarItem: FC<SidebarItemProps> = ({ sidebarValue, pathNow }) => {
    const { setter } = useSidebar()
    const isSelected = pathNow === sidebarValue.name
    return <Link href={`/${sidebarValue.name}`} onClick={() => setter('setPath', sidebarValue.name as pathOption)}>
        <div className={`px-3 py-2 w-fit rounded-md flex flex-col items-center justify-center cursor-pointer  ${isSelected && 'border-green-300 border bg-green-100/30'}`}>
            {sidebarValue.icon && cloneElement(sidebarValue.icon, { color: isSelected ? '#4ade80' : '#a1a1aa' })}
            <p className={`capitalize ${isSelected ? 'text-green-300' : 'text-zinc-400'}`}>{sidebarValue.name}</p>
        </div>
    </Link>
}


export default Sidebar;