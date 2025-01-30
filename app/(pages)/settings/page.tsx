'use client'
import { getAuthInfo } from '@/lib/auth/jwt';
import _profileSettings from './_settingsComponents/_profileSettings';
import { FC, useEffect, useState } from 'react';
import { Loading } from '@/components/ui/loading';
import { AuthInfoPayload } from '@/types/session';
import Tab from '@/components/client/tab';

interface PageProps {

}

const Page: FC<PageProps> = ({ }) => {
    const authInfoInit = {
        email: '',
        exp: 0,
        expiredAt: 0,
        iat: 0,
        id: 0,
        name: '',
        role: ''
    }
    const [isLoading, setIsLoading] = useState(true)
    const [authInfo, setAuthInfo] = useState(authInfoInit)
    const [selectedTab, setSelectedTab] = useState('profile')
    const settingsOption = [
        {
            name: 'profile',
        },
        {
            name: 'general'
        }
    ]
    const fetchAuthInfo = async () => {
        try {
            const response = await getAuthInfo()
            if (!response) {
                throw new Error('Failed to get auth info!')
            }
            setAuthInfo(response)
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false)
        }
    }
    function showPageHandler() {
        if (selectedTab == 'profile') return <_profileSettings authInfo={authInfo} />
    }
    useEffect(() => {
        fetchAuthInfo()
    }, [])
    if (isLoading) return <Loading className='absolute top-1/2 left-1/2' size={50} />
    return <div className='px-5 w-full'>
        <Tab settingsOption={settingsOption} selectedTab={selectedTab} setter={setSelectedTab} />
        {showPageHandler()}
    </div>;
}

export default Page;