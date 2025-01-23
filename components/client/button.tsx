'use client'
import { FC } from 'react';
import { Button, ButtonProps } from '../ui/button';
import { PanelRight } from 'lucide-react';
import { useSidebar } from '../context/sidebarContext';

interface SidebarActivationButtonProps extends ButtonProps {

}

export const SidebarActivationButton: FC<SidebarActivationButtonProps> = ({ ...props }) => {
    const { state, setter } = useSidebar()
    return <Button {...props} onClick={() => setter("setStatus", !state)}>
        <PanelRight />
    </Button>
}
