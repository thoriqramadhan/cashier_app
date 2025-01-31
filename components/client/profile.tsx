'use client'
import { FC } from 'react';
import { DropdownContainer, DropdownItem } from './dropdown';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/action/logout';

interface ProfileProps {

}

const Profile: FC<ProfileProps> = ({ }) => {
    const router = useRouter()
    return <DropdownContainer appereance={<div className="h-[36px] w-[36px] bg-zinc-50 rounded-full cursor-pointer"></div>}>
        <DropdownItem onClick={() => router.push('/settings?tab=profile')}>
            Profile
        </DropdownItem>
        <DropdownItem icon={<LogOut />} onClick={() => logout()}>
            Logout
        </DropdownItem>
    </DropdownContainer>
}

export default Profile;