'use client'
import { FC } from 'react';
import { DropdownContainer, DropdownItem } from './dropdown';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/action/logout';
import { useSidebar } from '../context/sidebarContext';

interface ProfileProps {

}

const Profile: FC<ProfileProps> = ({ }) => {
    const router = useRouter()
    const { setter } = useSidebar()
    function redirectToProfile() {
        router.push('/settings?tab=profile')
        setter('setPath', 'settings')
    }
    return <DropdownContainer appereance={<div className="h-[36px] w-[36px] bg-zinc-50 rounded-full cursor-pointer"></div>}>
        <DropdownItem onClick={() => redirectToProfile()}>
            Profile
        </DropdownItem>
        <DropdownItem icon={<LogOut />} onClick={() => logout()}>
            Logout
        </DropdownItem>
    </DropdownContainer>
}

export default Profile;