import { FC } from 'react';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

interface InputSearchProps {

}

export const InputSearch: FC<InputSearchProps> = ({ }) => {
    return <div className="relative h-full flex items-center">
        <Input className='h-[70%] w-[300px] pl-10' placeholder='Search something.....' />
        <Search size={15} className='absolute -translate-y-1/2 top-1/2 translate-x-full' />
    </div>
}

