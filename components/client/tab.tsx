'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { Children, Dispatch, FC, SetStateAction } from 'react';

type tabOption = { name: string }
interface TabProps {
    children: React.ReactNode
}


const Tab: FC<TabProps> = ({ children }) => {
    return <div className="w-full flex gap-x-3 my-5">
        {
            children
        }
    </div>
}


interface TabItemProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string,
    selectedTab: string,

}

export const TabItem: FC<TabItemProps> = ({ name, selectedTab, ...props }) => {
    return <span {...props} className={`block px-5 py-2 ${selectedTab == name ? 'bg-darkerMain text-white' : 'bg-zinc-50 text-slate-700  hover:bg-zinc-200/50'} rounded-full font-medium cursor-pointer transition-300 capitalize`}>
        {name}
    </span>
}


export default Tab;