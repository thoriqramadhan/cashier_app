import { FC } from 'react';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/className';

interface InputSearchProps {
    className?: string,
    placeHolder?: string
}

export const InputSearch: FC<InputSearchProps> = ({ className, placeHolder }) => {
    return <div className="relative h-full flex items-center">
        <Input className={cn('h-[70%] w-[300px] pl-10 ', className)} placeholder={placeHolder ? placeHolder : 'Search something.....'} />
        <Search size={15} className='absolute -translate-y-1/2 top-1/2 translate-x-full' />
    </div>
}

