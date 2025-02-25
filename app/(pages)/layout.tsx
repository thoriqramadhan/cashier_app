import Breadcrumbs from '@/components/client/breadcrumbs';
import { SidebarActivationButton } from '@/components/client/button';
import Modal from '@/components/client/modal';
import Profile from '@/components/client/profile';
import { ModalContextProvider } from '@/components/context/modalContext';
import SidebarContextProvider from '@/components/context/sidebarContext';
import Sidebar from '@/components/ui/sidebar';
import { getAuthInfo } from '@/lib/auth/jwt';
import { headers } from 'next/headers';
import { FC } from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: FC<LayoutProps> = async ({ children }) => {
    const authInfo = await getAuthInfo()
    const headerList = await headers()
    const pathNameUnfiltered = headerList.get("x-current-path")
    const pathName = pathNameUnfiltered?.split('/').filter(item => item.length > 0) ?? []

    return <SidebarContextProvider authInfo={authInfo} pathNow={pathName[pathName.length - 1]}>
        <ModalContextProvider>
            <div className="flex">
                <Sidebar />
                <div className="w-full max-h-screen overflow-y-auto">
                    <div className="my-2 px-5 flex h-[36px] w-full items-center justify-between">
                        <div className="flex h-full items-center gap-x-3">
                            <SidebarActivationButton variant={'ghost'} className="px-3 py-2" />
                            <div className="h-3/4 w-px bg-zinc-200"></div>
                            <Breadcrumbs />
                        </div>
                        <Profile />
                    </div>
                    {children}
                </div>
            </div>
        </ModalContextProvider>
    </SidebarContextProvider>
}

export default Layout;