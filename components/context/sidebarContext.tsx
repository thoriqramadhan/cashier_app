'use client'
import { jwtPayload } from '@/types/login';
import React, { createContext, FC, useContext, useState } from 'react';

interface SidebarContextProps {
    children: React.ReactNode,
    authInfo: jwtPayload
}
type contextOutput = {
    state: boolean,
    setter: React.Dispatch<React.SetStateAction<boolean>>
}
const SidebarContext = createContext<contextOutput | undefined>(undefined)

const SidebarContextProvider: FC<SidebarContextProps> = ({ children }) => {
    const [sidebarState, setSidebarState] = useState(false)
    function handleSidebarState() {
        setSidebarState(prev => !prev);
    }
    return <SidebarContext.Provider value={{ state: sidebarState, setter: handleSidebarState }}>
        {children}
    </SidebarContext.Provider>
}

export function useSidebar() {
    const contextData = useContext(SidebarContext);
    return contextData as contextOutput;
}

export default SidebarContextProvider;