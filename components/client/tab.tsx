'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { Dispatch, FC, SetStateAction } from 'react';

type tabOption = { name: string }
interface TabProps {
    selectedTab: string,
    settingsOption: tabOption[],
    setter: Dispatch<SetStateAction<string>>
}


const Tab: FC<TabProps> = ({ selectedTab, settingsOption, setter }) => {
    const router = useRouter()
    function handleOnClick(name: string) {
        router.replace(`/settings?tab=${name}`)
        setter(name)
    }
    return <div className="w-full flex gap-x-3 my-5">
        {settingsOption.map((option, index) => (
            <span className={`block px-5 py-2 ${selectedTab == option.name ? 'bg-darkerMain text-white' : 'bg-zinc-50 text-slate-700  hover:bg-zinc-200/50'} rounded-full font-medium cursor-pointer transition-300 capitalize`} key={index} onClick={() => handleOnClick(option.name)}>
                {option.name}
            </span>
        ))}
    </div>
}


interface TabItemProps {
    name: string
}

const TabItem: FC<TabItemProps> = ({ name }) => {
    return <span className={`block px-5 py-2 ${selectedTab == name ? 'bg-main text-white' : 'bg-zinc-50 text-slate-700  hover:bg-zinc-200/50'} rounded-full font-medium cursor-pointer transition-300 capitalize`} key={index} onClick={() => setter(name)}>
        {name}
    </span>
}


export default Tab;