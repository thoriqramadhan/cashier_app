'use client'
import { BaggageClaim, BookUser, ChartColumnStacked, Clock, Contact, House, Settings, Utensils } from 'lucide-react';
import React, { cloneElement, FC } from 'react';
import Link from 'next/link';

import { useSidebar } from '../context/sidebarContext';
import { pathOption } from '@/types/sidebar';
import { cn } from '@/lib/utils';

interface SidebarProps {

}

const Sidebar: FC<SidebarProps> = ({ }) => {
    const { state, setter } = useSidebar();
    const isAdmin = state.role === 'admin';

    const sidebarOption = [
        {
            name: 'home',
            icon: <House />,
        },
        {
            name: 'orders',
            icon: <BaggageClaim />,
        },
        {
            name: 'history',
            icon: <Clock />,
        },
        {
            name: 'products',
            icon: <Utensils />,
            admin: true
        },
        {
            name: 'category',
            icon: <ChartColumnStacked />,
            admin: true
        },
        {
            name: 'attendance',
            icon: <BookUser />,
            general: true
        },
        {
            name: 'employee',
            icon: <Contact />,
            admin: true
        },
        {
            name: 'settings',
            icon: <Settings />,
            general: true
        }
    ]
    return <div className={`h-screen bg-white shadow-lg border-r transition-300 flex flex-col items-center gap-y-5 ${state.sidebarStatus ? 'w-[150px] px-3 py-6' : 'w-0 opacity-0'}`}>
        {
            sidebarOption.map((item, index) => (
                <SidebarItem key={index} sidebarValue={item} pathNow={state.sidebarPath} isAdmin={isAdmin} />
            ))
        }
    </div>
}


type sidebarValue = {
    name: string,
    icon: React.ReactNode,
    admin?: boolean,
    general?: boolean
}
interface SidebarItemProps {
    sidebarValue: sidebarValue,
    pathNow: string,
    isAdmin: boolean
}

const SidebarItem: FC<SidebarItemProps> = ({ sidebarValue, pathNow, isAdmin }) => {
    const { state, setter } = useSidebar()
    const isSelected = pathNow === sidebarValue.name
    // set visibility by role & condition'
    return <Link className={cn(sidebarValue.admin && 'hidden', sidebarValue.admin && isAdmin && 'block', !sidebarValue?.admin && isAdmin && !sidebarValue.general && 'hidden', !state.sidebarStatus && 'hidden')
    } href={`/${sidebarValue.name}`} onClick={() => setter('setPath', sidebarValue.name as pathOption)}>
        <div className={`px-3 py-2 w-fit rounded-md flex flex-col items-center justify-center cursor-pointer  ${isSelected && 'border-green-300 border bg-green-100/30'}`}>
            {sidebarValue.icon && cloneElement(sidebarValue.icon, { color: isSelected ? '#4ade80' : '#a1a1aa' })}
            <p className={`capitalize ${isSelected ? 'text-green-300' : 'text-zinc-400'}`}>{sidebarValue.name}</p>
        </div>
    </Link >
}


export default Sidebar;