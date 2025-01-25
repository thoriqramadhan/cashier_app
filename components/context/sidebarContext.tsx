'use client'
import { jwtPayload } from '@/types/login';
import React, { createContext, FC, useContext, useState } from 'react';

import { contextOutput, pathOption, setterArguments } from '@/types/sidebar';

interface SidebarContextProps {
    children: React.ReactNode,
    authInfo: jwtPayload,
    pathNow: string
}

const SidebarContext = createContext<contextOutput | undefined>(undefined)

const SidebarContextProvider: FC<SidebarContextProps> = ({ pathNow, authInfo, children }) => {
    const sidebarStateInit = {
        sidebarStatus: true,
        sidebarPath: pathNow,
        role: authInfo.role
    }
    const [sidebarState, setSidebarState] = useState(sidebarStateInit)
    function handleSidebarState(option: setterArguments, value: pathOption | boolean) {
        if (option == 'setStatus') {
            setSidebarState(prev => {
                return {
                    ...prev,
                    sidebarStatus: !prev.sidebarStatus
                }
            })
        }
        if (option == 'setPath') {
            setSidebarState(prev => {
                return {
                    ...prev,
                    sidebarPath: value as pathOption
                }
            })
        }

        // trik dari sepuh
        // setSidebarState(prev =>
        // ({
        //     sidebarPath: option === 'setPath' ? value as pathOption : prev.sidebarPath,
        //     sidebarStatus: option === 'setStatus' ? !prev.sidebarStatus : prev.sidebarStatus
        // })
        // )
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