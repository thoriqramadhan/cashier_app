'use client'
import { FC } from 'react';
import { useSidebar } from '../context/sidebarContext';

interface SidebarProps {

}

const Sidebar: FC<SidebarProps> = ({ }) => {
    const { state, setter } = useSidebar();
    return <div className={`h-screen bg-white shadow-lg border-r transition-300  ${state.sidebarStatus ? 'w-[150px] p-3 ' : 'w-0 opacity-0'}`}>
        <p>Hello</p>
    </div>
}

export default Sidebar;