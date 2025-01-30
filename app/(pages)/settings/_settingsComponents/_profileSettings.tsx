'use client'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthInfoPayload } from '@/types/session';
import { handleChangeProfileArgs } from '@/types/settings';
import { FC, useEffect, useState } from 'react';

interface _profileSettingsProps {
    authInfo: AuthInfoPayload
}

const _profileSettings: FC<_profileSettingsProps> = ({ authInfo }) => {
    const profileSettingsInit = {
        username: authInfo.name,
        role: authInfo.role,
        email: authInfo.email,
        password: ''
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [profileState, setProfileState] = useState(profileSettingsInit)
    const isAdmin = profileSettingsInit.role === 'admin';
    function handleChangeProfile(value: handleChangeProfileArgs) {
        setProfileState(prev => (
            {
                ...prev,
                ...value
            }
        ))
    }
    useEffect(() => {
        console.log(profileState);

    }, [profileState])
    return <>
        <div className="">
            <h3 className='text-slate-900 font-semibold'>Profile</h3>
            <p className='text-sm font-thin'>Set yout account detail.</p>
        </div>
        <div className="my-5 flex flex-col gap-y-3">
            <div className="w-[150px] h-[150px] bg-zinc-50 rounded-full"></div>
        </div>
        <div className="flex w-[70%] space-x-3 mb-5">
            <div className='space-y-1 flex-1'>
                <Label>Username</Label>
                <Input name='username' type='text' id='username' disabled={!isAdmin} value={profileState.username} onChange={(event) => handleChangeProfile({ username: event.target.value })} />
            </div>
            <div className='space-y-1 flex-1'>
                <Label>Role</Label>
                <Input name='role' type='text' id='role' disabled={!isAdmin} value={profileState.role} onChange={(event) => handleChangeProfile({ role: event.target.value })} />
            </div>
        </div>
        <div className="flex w-[70%] space-x-3">
            <div className='space-y-1 flex-1'>
                <Label>Email</Label>
                <Input name='email' type='text' id='email' disabled={!isAdmin} value={profileState.email} onChange={(event) => handleChangeProfile({ email: event.target.value })} />
            </div>
            <div className='space-y-1 flex-1'>
                <Label>Password</Label>
                <Input name='password' type='text' id='password' disabled={!isAdmin} value={profileState.password} onChange={(event) => handleChangeProfile({ password: event.target.value })} />
            </div>
        </div>
    </>
}

export default _profileSettings;