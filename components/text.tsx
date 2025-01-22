import { cn } from '@/lib/utils';
import { FC } from 'react';

interface ErrorTextProps {
    children: React.ReactNode,
    className?: string
}

export const ErrorText: FC<ErrorTextProps> = ({ children, className }) => {
    return <div className={cn('text-sm text-red-400', className)}>{children}</div>;
}
