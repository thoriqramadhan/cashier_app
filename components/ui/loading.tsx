import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { FC } from 'react';

interface LoadingProps {
    className?: string,
    size?: number
}

export const Loading: FC<LoadingProps> = ({ className, size }) => {

    return <Loader2 size={size ?? 30} className={cn('animate-spin', className)} />
}
