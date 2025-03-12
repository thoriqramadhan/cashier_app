'use client'
import { getAuthInfo } from '@/lib/auth/jwt';
import _profileSettings from './_settingsComponents/_profileSettings';
import _taxSettings from './_settingsComponents/_taxSettings';
import { FC, useEffect, useState } from 'react';
import { Loading } from '@/components/ui/loading';
import Tab, { TabItem } from '@/components/client/tab';
import { useRouter, useSearchParams } from 'next/navigation';

interface PageProps {

}

const Page: FC<PageProps> = ({ }) => {
    const router = useRouter()
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
    const searchParams = useSearchParams();
    const paramQuery = searchParams.get('tab')
    const [selectedTab, setSelectedTab] = useState(paramQuery ?? 'profile')

    const settingsOption = [
        {
            name: 'profile',
        },
        {
            name: 'general'
        }, {
            name: 'tax'
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
        if (selectedTab == 'profile') {
            return <_profileSettings authInfo={authInfo} />
        } else if (selectedTab == 'tax') {
            return <_taxSettings authInfo={authInfo} />
        }
    }
    function handleChangeRoute(name: string) {
        console.log('clicked');

        setSelectedTab(name)
        router.push(`/settings?tab=${name}`)
    }
    useEffect(() => {
        fetchAuthInfo()
    }, [])
    if (isLoading) return <Loading className='absolute top-1/2 left-1/2' size={50} />
    return <div className='px-5 w-full'>
        <Tab >
            {
                settingsOption.map((option, index) => (
                    <TabItem key={index} name={option.name} selectedTab={selectedTab} onClick={() => handleChangeRoute(option.name)} />
                ))
            }
        </Tab>
        {showPageHandler()}
    </div>;
}

export default Page;